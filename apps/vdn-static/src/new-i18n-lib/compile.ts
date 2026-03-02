import type { Result, Value } from "@/utils/types";
import {
	computeAllVariants,
	selectionChainToString,
	type PatternVariant,
	type UncompiledLocale,
} from "./setup";
import type { FluentBundle, FluentVariable, Message } from "@fluent/bundle";
import { parseMarkdown, type Markdown } from "./markdown";
import {
	configMarkdownSymbol,
	configMessageTypeSymbol,
	configStringSymbol,
	type ConfigMarkdown,
	type ConfigString,
	type InferLocaleFromConfig,
	type LocaleConfig,
} from "./config";
import type { Pattern } from "@fluent/bundle/esm/ast";

type GenericLocale = { [id: string]: GenericLocale | GenericMessageFn };

type GenericMessageFn = GenericStringMessageFn | GenericMarkdownMessageFn;

type GenericStringMessageFn = (
	placeableArgs?: GenericMessageFnPlaceableArgs,
) => string;

type GenericMarkdownMessageFn = (
	placeableArgs?: GenericMessageFnPlaceableArgs,
) => Markdown;

type GenericMessageFnPlaceableArgs = Record<string, FluentVariable>;

export interface CompileLocaleCtx<Config extends LocaleConfig> {
	bundle: FluentBundle;
	uncompiled: UncompiledLocale;
	config: Config;
	fallback: InferLocaleFromConfig<Config> | undefined;
	messageIdChain: readonly string[];
}

export interface CompileLocaleRes<Locale> {
	locale: Locale;
	errors: string[];
}

export function compileLocale<Config extends LocaleConfig>(
	ctx: CompileLocaleCtx<Config>,
): CompileLocaleRes<InferLocaleFromConfig<Config>> {
	const {
		bundle,
		uncompiled,
		config,
		fallback,
		messageIdChain: localeMessageIdChain = [],
	} = ctx;

	const errors: string[] = [];

	const uncompiledKeys = new Set(Object.keys(uncompiled ?? {}));
	const configKeys = new Set(Object.keys(config));
	const excessKeys = uncompiledKeys.difference(configKeys);
	if (excessKeys.size > 0) {
		errors.push(`Excess keys in record: ${[...excessKeys].join(", ")}`);
	}

	const locale: GenericLocale = {};
	for (const [messageId, configValue] of Object.entries(config)) {
		const uncompiledValue = uncompiled?.[messageId];
		const fallbackValue = fallback?.[messageId];
		const valueMessageIdChain = [
			...localeMessageIdChain,
			messageId,
		] as const;

		const compiledValue = ((): Value<GenericLocale> => {
			if (configMessageTypeSymbol in configValue) {
				const compiledMessage = (() => {
					if (uncompiledValue?.type !== "message") {
						errors.push(
							`Expected message for key \`${messageId}\`, found: ${typeof uncompiledValue}`,
						);

						return undefined;
					}

					const uncompiledMessage = uncompiledValue.message;
					const compiledMessageRes = compileMessage({
						bundle,
						messageIdChain: valueMessageIdChain,
						configValue,
						uncompiledMessage,
					});

					if (compiledMessageRes.type === "err") {
						errors.push(compiledMessageRes.err);
						return undefined;
					}

					const compiledMessage = compiledMessageRes.ok;
					return compiledMessage;
				})();

				if (compiledMessage !== undefined) {
					return compiledMessage;
				}

				if (
					fallbackValue !== undefined
					&& typeof fallbackValue === "function"
				) {
					return fallbackValue as GenericMessageFn;
				}

				switch (configValue[configMessageTypeSymbol]) {
					case configStringSymbol: {
						return () =>
							createMissingStringFallback(valueMessageIdChain);
					}
					case configMarkdownSymbol: {
						return () =>
							createMissingMarkdownFallback(
								valueMessageIdChain,
								Object.keys(configValue.features.slots),
							);
					}
				}
			} else {
				const uncompiledSubrecord = (() => {
					if (uncompiledValue?.type !== "subrecord") {
						errors.push(
							`Expected subrecord for key \`${messageId}\`, found: ${typeof uncompiledValue}`,
						);

						return undefined;
					}

					return uncompiledValue.subrecord;
				})();

				return compileSublocale({
					subconfig: configValue,
					uncompiledSublocale: uncompiledSubrecord,
					fallbackSublocale:
						typeof fallbackValue === "function" ? undefined : (
							fallbackValue
						),
					errors,
					bundle,
					messageIdChain: valueMessageIdChain,
				});
			}
		})();

		locale[messageId] = compiledValue;
	}

	// SAFETY: validated above that all keys exist and are the correct type
	return { locale: locale as InferLocaleFromConfig<Config>, errors };
}

function fmtMessageIdChain(
	messageIdChain: readonly [...string[], string],
): string {
	return messageIdChain.join("-");
}

interface CompileMessageCtx {
	bundle: FluentBundle;
	messageIdChain: readonly [...string[], string];
	configValue: ConfigString<object> | ConfigMarkdown<object, object>;
	uncompiledMessage: Message;
}

function compileMessage(
	ctx: CompileMessageCtx,
): Result<GenericMessageFn, string> {
	const { bundle, messageIdChain, configValue, uncompiledMessage } = ctx;

	const pattern = uncompiledMessage.value;
	if (pattern === null) {
		return {
			type: "err",
			err: `Pattern is null for message with ID: ${fmtMessageIdChain(messageIdChain)}`,
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
							err: `Expected selector to be a var expression for ID: ${fmtMessageIdChain(messageIdChain)}; Found: ${selector.type}`,
						};
					}

					if (
						!Object.keys(configValue.placeables).includes(
							selector.name,
						)
					) {
						return {
							type: "err",
							err: `Found unexpected placeable name \`${selector.name}\` for ID: ${fmtMessageIdChain(messageIdChain)}`,
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
							err: `Found unexpected placeable name \`${element.name}\` for ID: ${fmtMessageIdChain(messageIdChain)}`,
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
			err: `Failed to compute variants for ID \`${fmtMessageIdChain(messageIdChain)}\`:\n${allVariantsRes.err}`,
		};
	}

	const allVariants = allVariantsRes.ok;

	switch (configValue[configMessageTypeSymbol]) {
		case configStringSymbol: {
			return compileStringMessage({
				bundle,
				messageIdChain,
				allVariants,
				pattern,
			});
		}
		case configMarkdownSymbol: {
			return compileMarkdownMessage({
				bundle,
				configMarkdown: configValue,
				messageIdChain,
				allVariants,
				pattern,
			});
		}
	}
}

interface CompileStringMessageCtx {
	bundle: FluentBundle;
	messageIdChain: readonly [...string[], string];
	allVariants: readonly PatternVariant[];
	pattern: Pattern;
}

function compileStringMessage(
	ctx: CompileStringMessageCtx,
): Result<GenericStringMessageFn, string> {
	const { bundle, messageIdChain, allVariants, pattern } = ctx;

	// typecheck string
	// check if all variants are valid markdown
	for (const variant of allVariants) {
		const stringLiteralRes = parseMessageLiteral("string", variant.string);

		if (stringLiteralRes.type === "err") {
			return {
				type: "err",
				err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of ID \`${fmtMessageIdChain(messageIdChain)}\`:\n${stringLiteralRes.err}`,
			};
		}

		const stringLiteral = stringLiteralRes.ok;
		const stringRes = parseString(stringLiteral);
		if (stringRes.type === "err") {
			return {
				type: "err",
				err: `Invalid string for variant \`${selectionChainToString(variant.selectionChain)}\` of ID \`${fmtMessageIdChain(messageIdChain)}\`:\n${stringRes.err}`,
			};
		}
	}

	// TODO: will need to make sure markdown/slots are escapes when inserting variable values
	return {
		type: "ok",
		ok: (args: Record<string, FluentVariable> = {}) => {
			const stringRes = ((): Result<string, string> => {
				const stringLiteralRes = parseMessageLiteral(
					"string",
					bundle.formatPattern(pattern, args),
				);

				if (stringLiteralRes.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid strings above
					return {
						type: "err",
						err: `Failed to parse string literal after compilation!\n${stringLiteralRes.err}`,
					};
				}

				const stringLiteral = stringLiteralRes.ok;

				const res = parseString(stringLiteral);

				if (res.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid strings above
					// TODO: no we dont, do that
					return {
						type: "err",
						err: `Failed to parse string after compilation!\n${res.err}`,
					};
				}

				const string = res.ok;
				return { type: "ok", ok: string };
			})();

			switch (stringRes.type) {
				case "ok": {
					const string = stringRes.ok;
					return string;
				}
				case "err": {
					const error = stringRes.err;
					console.error(error);
					return createMissingStringFallback(messageIdChain);
				}
			}
		},
	};
}

interface CompileMarkdownMessageCtx {
	bundle: FluentBundle;
	messageIdChain: readonly [...string[], string];
	configMarkdown: ConfigMarkdown<object, object>;
	allVariants: readonly PatternVariant[];
	pattern: Pattern;
}

function compileMarkdownMessage(
	ctx: CompileMarkdownMessageCtx,
): Result<GenericMarkdownMessageFn, string> {
	const { bundle, messageIdChain, configMarkdown, allVariants, pattern } =
		ctx;

	// typecheck markdown

	const markdownSlots = Object.keys(configMarkdown.features.slots);

	// check if all variants are valid markdown
	for (const variant of allVariants) {
		const markdownLiteralRes = parseMessageLiteral("md", variant.string);

		if (markdownLiteralRes.type === "err") {
			return {
				type: "err",
				err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of ID \`${fmtMessageIdChain(messageIdChain)}\`:\n${markdownLiteralRes.err}`,
			};
		}

		const markdownLiteral = markdownLiteralRes.ok;
		const markdownRes = parseMarkdown(markdownLiteral, markdownSlots);

		if (markdownRes.type === "err") {
			return {
				type: "err",
				err: `Invalid markdown for variant \`${selectionChainToString(variant.selectionChain)}\` of ID \`${fmtMessageIdChain(messageIdChain)}\`:\n${markdownRes.err}`,
			};
		}
	}

	// TODO: will need to make sure markdown/slots are escapes when inserting variable values
	return {
		type: "ok",
		ok: (args: Record<string, FluentVariable> = {}): Markdown => {
			const markdownRes = ((): Result<Markdown, string> => {
				const markdownLiteralRes = parseMessageLiteral(
					"md",
					bundle.formatPattern(pattern, args),
				);

				if (markdownLiteralRes.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid markdown above
					return {
						type: "err",
						err: `Failed to parse markdown literal after compilation!\n${markdownLiteralRes.err}`,
					};
				}

				const markdownLiteral = markdownLiteralRes.ok;
				const res = parseMarkdown(markdownLiteral, markdownSlots);

				if (res.type === "err") {
					// This should hopefully never happen since we've already
					// verified all message variants parse as valid markdown above
					return {
						type: "err",
						err: `Failed to parse markdown after compilation!\n${res.err}`,
					};
				}

				return { type: "ok", ok: res.ok };
			})();

			switch (markdownRes.type) {
				case "ok": {
					const markdown = markdownRes.ok;
					return markdown;
				}
				case "err": {
					const error = markdownRes.err;
					console.error(error);
					return createMissingMarkdownFallback(
						messageIdChain,
						markdownSlots,
					);
				}
			}
		},
	};
}

function createMissingStringFallback(
	messageIdChain: readonly [...string[], string],
): string {
	return `[#${fmtMessageIdChain(messageIdChain)}#]`;
}

function createMissingMarkdownFallback<Slot extends string>(
	messageIdChain: readonly [...string[], string],
	slots: Slot[],
): Markdown<Slot> {
	return {
		elements: [
			{
				type: "paragraph",
				paragraph: {
					spans: [
						{
							type: "plain",
							plain: createMissingStringFallback(messageIdChain),
						},
					],
				},
			},
		],
		slots,
	};
}

interface CompileSublocaleCtx<Subconfig extends LocaleConfig> {
	subconfig: Subconfig;
	uncompiledSublocale: UncompiledLocale | undefined;
	fallbackSublocale: InferLocaleFromConfig<Subconfig> | undefined;
	errors: string[];
	bundle: FluentBundle;
	messageIdChain: readonly [...string[], string];
}

function compileSublocale<Subconfig extends LocaleConfig>(
	ctx: CompileSublocaleCtx<Subconfig>,
): InferLocaleFromConfig<Subconfig> {
	const {
		subconfig: configValue,
		uncompiledSublocale: recordValue,
		fallbackSublocale: fallbackValue,
		errors,
		bundle,
		messageIdChain,
	} = ctx;

	const subrecord = recordValue;
	const compiledSubrecordRes = compileLocale({
		bundle,
		uncompiled: subrecord ?? {},
		config: configValue,
		fallback: fallbackValue,
		messageIdChain,
	});

	errors.push(
		...compiledSubrecordRes.errors.map(
			(err) =>
				`Error when compiling subrecord with ID: \`${fmtMessageIdChain(messageIdChain)}\`:\n${err}`,
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
