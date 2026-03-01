import type { Result, Value } from "@/utils/types";
import {
	computeAllVariants,
	selectionChainToString,
	type L10nRecord,
	type UncompiledLocale,
} from "./setup";
import type { FluentBundle, FluentVariable } from "@fluent/bundle";
import { parseMarkdown, type Markdown } from "./markdown";
import {
	configMessageSymbol,
	type ConfigMessage,
	type InferLocale,
	type LocaleConfig,
} from "./config";

export interface CompileLocaleCtx<Config extends LocaleConfig> {
	bundle: FluentBundle;
	record: L10nRecord | undefined;
	config: Config;
	fallback?: InferLocale<Config>;
}

export interface CompileLocaleRes<Locale> {
	locale: Locale;
	errors: string[];
}

type GenericLocale = { [id: string]: GenericLocale | GenericMessageFn };

type GenericMessageFn =
	| ((args?: Record<string, FluentVariable>) => string)
	| ((args?: Record<string, FluentVariable>) => Markdown);

export function compileLocale<Config extends LocaleConfig>(
	ctx: CompileLocaleCtx<Config>,
): CompileLocaleRes<InferLocale<Config>> {
	const { bundle, record, config, fallback } = ctx;

	const errors: string[] = [];

	const recordKeys = new Set(Object.keys(record ?? {}));
	const configKeys = new Set(Object.keys(config));
	const excessKeys = recordKeys.difference(configKeys);
	if (excessKeys.size > 0) {
		errors.push(`Excess keys in record: ${[...excessKeys].join(", ")}`);
	}

	const locale: GenericLocale = {};
	for (const [messageId, configValue] of Object.entries(config)) {
		const recordValue = record?.[messageId];
		const fallbackValue = fallback?.[messageId];

		const compiledValue = ((): Value<GenericLocale> => {
			if (configMessageSymbol in configValue) {
				const compiledMessageRes = compileMessage({
					bundle,
					messageId,
					configValue,
					recordValue,
				});

				const compiledMessage = ((): GenericMessageFn => {
					if (compiledMessageRes.type === "ok") {
						return compiledMessageRes.ok;
					}

					errors.push(compiledMessageRes.err);

					if (
						fallbackValue !== undefined
						&& typeof fallbackValue === "function"
					) {
						return fallbackValue as GenericMessageFn;
					}

					return () => `[PLACEHOLDER]${messageId}`;
				})();

				return compiledMessage;
			} else {
				const subrecord = (() => {
					if (recordValue?.type !== "subrecord") {
						errors.push(
							`Expected subrecord for key \`${messageId}\`, found: ${typeof recordValue}`,
						);

						return undefined;
					}

					return recordValue.subrecord;
				})();

				return compileSublocale({
					subconfig: configValue,
					recordSublocale: subrecord,
					fallbackSublocale:
						typeof fallbackValue === "function" ? undefined : (
							fallbackValue
						),
					errors,
					bundle,
					messageId,
				});
			}
		})();

		locale[messageId] = compiledValue;
	}

	// SAFETY: validated above that all keys exist and are the correct type
	return { locale: locale as InferLocale<Config>, errors };
}

interface CompileMessageCtx {
	bundle: FluentBundle;
	messageId: string;
	configValue: ConfigMessage;
	recordValue: Value<UncompiledLocale["record"]> | undefined;
}

function compileMessage(
	ctx: CompileMessageCtx,
): Result<GenericMessageFn, string> {
	const { bundle, messageId, configValue, recordValue } = ctx;

	if (recordValue?.type !== "message") {
		return {
			type: "err",
			err: `Expected message for key \`${messageId}\`, found: ${typeof recordValue}`,
		};
	}

	const message = recordValue.message;

	const pattern = message.value;
	if (pattern === null) {
		return {
			type: "err",
			err: `Pattern is null for message with ID: ${messageId}`,
		};
	}

	// validate placeables
	if (typeof pattern !== "string") {
		for (const element of pattern) {
			if (typeof element === "string") {
				continue;
			}

			switch (element.type) {
				case "select": {
					const { selector } = element;
					if (selector.type !== "var") {
						return {
							type: "err",
							err: `Expected selector to be a var expression for key: ${messageId}; Found: ${selector.type}`,
						};
					}

					if (
						!Object.keys(configValue.placeables).includes(
							selector.name,
						)
					) {
						return {
							type: "err",
							err: `Found unexpected placeable name \`${selector.name}\` for key: ${messageId}`,
						};
					}

					break;
				}
				case "var": {
					if (
						!Object.keys(configValue.placeables).includes(
							element.name,
						)
					) {
						return {
							type: "err",
							err: `Found unexpected placeable name \`${element.name}\` for key: ${messageId}`,
						};
					}

					break;
				}
				case "term":
				case "mesg":
				case "func":
				case "str":
				case "num": {
					break; // ignore
				}
			}
		}
	}

	const allVariantsRes = computeAllVariants(pattern);
	if (allVariantsRes.type === "err") {
		return {
			type: "err",
			err: `Failed to compute variants for key \`${messageId}\`:\n${allVariantsRes.err}`,
		};
	}

	const allVariants = allVariantsRes.ok;

	// create function
	const markdown = configValue.markdown;

	if (markdown !== null) {
		// typecheck markdown

		const markdownSlots = markdown.slots ?? [];

		// check if all variants are valid markdown
		for (const variant of allVariants) {
			const markdownLiteralRes = parseMessageLiteral(
				"md",
				variant.string,
			);

			if (markdownLiteralRes.type === "err") {
				return {
					type: "err",
					err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${messageId}\`:\n${markdownLiteralRes.err}`,
				};
			}

			const markdownLiteral = markdownLiteralRes.ok;
			const markdownRes = parseMarkdown(markdownLiteral, markdownSlots);

			if (markdownRes.type === "err") {
				return {
					type: "err",
					err: `Invalid markdown for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${messageId}\`:\n${markdownRes.err}`,
				};
			}
		}

		// TODO: will need to make sure markdown/slots are escapes when inserting variable values
		return {
			type: "ok",
			ok: (args: Record<string, FluentVariable> = {}) => {
				const markdownLiteralRes = parseMessageLiteral(
					"md",
					bundle.formatPattern(pattern, args),
				);

				if (markdownLiteralRes.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid markdown above
					throw new Error(
						`Failed to parse markdown literal after compilation!\n${markdownLiteralRes.err}`,
					);
				}

				const markdownLiteral = markdownLiteralRes.ok;
				const res = parseMarkdown(markdownLiteral, markdownSlots);

				if (res.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid markdown above
					throw new Error(
						`Failed to parse markdown after compilation!\n${res.err}`,
					);
				}

				return res.ok;
			},
		};
	} else {
		// typecheck string
		// check if all variants are valid markdown
		for (const variant of allVariants) {
			const stringLiteralRes = parseMessageLiteral(
				"string",
				variant.string,
			);

			if (stringLiteralRes.type === "err") {
				return {
					type: "err",
					err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${messageId}\`:\n${stringLiteralRes.err}`,
				};
			}

			const stringLiteral = stringLiteralRes.ok;
			const stringRes = parseString(stringLiteral);
			if (stringRes.type === "err") {
				return {
					type: "err",
					err: `Invalid string for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${messageId}\`:\n${stringRes.err}`,
				};
			}
		}

		// TODO: will need to make sure markdown/slots are escapes when inserting variable values
		return {
			type: "ok",
			ok: (args: Record<string, FluentVariable> = {}) => {
				const stringLiteralRes = parseMessageLiteral(
					"string",
					bundle.formatPattern(pattern, args),
				);

				if (stringLiteralRes.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid strings above
					throw new Error(
						`Failed to parse string literal after compilation!\n${stringLiteralRes.err}`,
					);
				}

				const stringLiteral = stringLiteralRes.ok;

				const res = parseString(stringLiteral);

				if (res.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid strings above
					// TODO: no we dont, do that
					throw new Error(
						`Failed to parse string after compilation!\n${res.err}`,
					);
				}

				return res.ok;
			},
		};
	}
}

interface CompileSublocaleCtx<Subconfig extends LocaleConfig> {
	subconfig: Subconfig;
	recordSublocale: L10nRecord | undefined;
	fallbackSublocale: InferLocale<Subconfig> | undefined;
	errors: string[];
	bundle: FluentBundle;
	messageId: string;
}

function compileSublocale<Subconfig extends LocaleConfig>(
	ctx: CompileSublocaleCtx<Subconfig>,
): InferLocale<Subconfig> {
	const {
		subconfig: configValue,
		recordSublocale: recordValue,
		fallbackSublocale: fallbackValue,
		errors,
		bundle,
		messageId,
	} = ctx;

	const subrecord = recordValue;
	const compiledSubrecordRes = compileLocale({
		bundle,
		record: subrecord,
		config: configValue,
		fallback: fallbackValue,
	});

	errors.push(
		...compiledSubrecordRes.errors.map(
			(err) =>
				`Error when compiling subrecord with key: \`${messageId}\`:\n${err}`,
		),
	);

	return compiledSubrecordRes.locale;
}

function parseMessageLiteral(
	type: "string" | "md",
	message: string,
): Result<string, string> {
	const trimmedMessage = message.trim();

	const maybeStartIndexes: number[] = [];
	const firstQuoteIndex = trimmedMessage.indexOf('"');
	if (firstQuoteIndex !== -1) {
		maybeStartIndexes.push(firstQuoteIndex);
	}

	const firstDashIndex = trimmedMessage.indexOf("-");
	if (firstDashIndex !== -1) {
		maybeStartIndexes.push(firstDashIndex);
	}

	const stringStartIndex = Math.min(...maybeStartIndexes);

	const actualPrefix = trimmedMessage.substring(0, stringStartIndex).trim();
	const expectedPrefix = (() => {
		switch (type) {
			case "string": {
				return "";
			}
			case "md": {
				return "md";
			}
		}
	})();

	if (actualPrefix !== expectedPrefix) {
		return {
			type: "err",
			err: `Expected prefix "${expectedPrefix}" for message with type \`${type}\`; Found: "${actualPrefix}"`,
		};
	}

	return {
		type: "ok",
		ok: trimmedMessage.substring(actualPrefix.length).trim(),
	};
}

function parseString(message: string): Result<string, string> {
	const AFFIX = '"';
	if (!message.startsWith(AFFIX)) {
		return {
			type: "err",
			err: `String message expected to start with \`${AFFIX}\``,
		};
	}

	if (!message.endsWith(AFFIX)) {
		return {
			type: "err",
			err: `String message expected to end with \`${AFFIX}\``,
		};
	}

	const deprefixed = message.substring(AFFIX.length);
	const dequoted = deprefixed.substring(0, deprefixed.length - AFFIX.length);
	return { type: "ok", ok: dequoted };
}
