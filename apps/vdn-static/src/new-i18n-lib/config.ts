import type { Result } from "@/utils/types";
import {
	computeAllVariants,
	selectionChainToString,
	type UncompiledLocale,
} from "./setup";
import type { FluentVariable } from "@fluent/bundle";
import { parseMarkdown, type Markdown } from "./markdown";
import { ignore } from "@/utils/ignore";

export const configMessageSymbol: unique symbol = Symbol("configMessage");
export interface ConfigMessage<
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = {
		[name in string]: ConfigPlaceableInfo;
	},
	Markdown extends
		ConfigMarkdown<string> | null = ConfigMarkdown<string> | null,
> {
	[configMessageSymbol]: true;
	placeables: Placeables;
	markdown: Markdown;
}

export interface ConfigPlaceableInfo<
	Type extends "string" | "number" = "string" | "number",
> {
	type: Type;
}

export interface ConfigMarkdown<Slot extends string> {
	bold?: boolean;
	italic?: boolean;
	header?: boolean;
	link?: boolean;
	ulist?: boolean;
	slots?: Slot[];
}

export function message<
	const Placeables extends {
		[name in string]?: ConfigPlaceableInfo;
	} = object,
	const Markdown extends ConfigMarkdown<string> | null = null,
>(
	opt: Partial<
		Omit<
			ConfigMessage<Placeables, ConfigMarkdown<never> | Markdown>,
			typeof configMessageSymbol
		>
	> = {},
): ConfigMessage<Placeables, Markdown> {
	return {
		[configMessageSymbol]: true,
		placeables: opt.placeables ?? {},
		markdown: opt.markdown ?? null,
	};
}

export type LocaleConfig<
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = object,
	Markdown extends
		ConfigMarkdown<string> | null = ConfigMarkdown<string> | null,
> = {
	[id: string]:
		| ConfigMessage<Placeables, Markdown>
		| LocaleConfig<Placeables, Markdown>;
};

type MessageCtx<
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = object,
> = {
	[K in keyof Placeables]: ResolvedPlaceableType<
		PlaceableType<Exclude<Placeables[K], undefined>>
	>;
};

type PlaceableType<Var extends ConfigPlaceableInfo> =
	Var extends ConfigPlaceableInfo<infer Type> ? Type : never;

type ResolvedPlaceableType<Type extends "string" | "number"> =
	Type extends "string" ? string
	: Type extends "number" ? number
	: never;

export type InferLocale<Config extends LocaleConfig> = {
	[K in keyof Config]: Config[K] extends LocaleConfig ? InferLocale<Config[K]>
	: Config[K] extends ConfigMessage<infer Placeables, infer Md> ?
		object extends MessageCtx<Placeables> ?
			() => null extends Md ? string
			: Md extends ConfigMarkdown<never> ? Markdown<never>
			: Md extends ConfigMarkdown<infer Slot> ? Markdown<Slot>
			: never
		:	(ctx: MessageCtx<Placeables>) => null extends Md ? string
			: Md extends ConfigMarkdown<never> ? Markdown<never>
			: Md extends ConfigMarkdown<infer Slot> ? Markdown<Slot>
			: never
	:	never;
};

export function record<const Key extends PropertyKey, T>(
	keys: readonly Key[],
	initializer: () => T,
): Record<Key, T> {
	const obj: Partial<Record<Key, T>> = {};
	for (const key of keys) {
		obj[key] = initializer();
	}

	// SAFETY: we set all properties from keys array above
	return obj as Record<Key, T>;
}

export interface CompileLocaleCtx<Config extends LocaleConfig> {
	uncompiled: UncompiledLocale;
	config: Config;
}

export function compileLocale<Config extends LocaleConfig>(
	ctx: CompileLocaleCtx<Config>,
): Result<InferLocale<Config>, string> {
	const { uncompiled, config } = ctx;

	const { record, bundle } = uncompiled;

	const recordKeys = new Set(Object.keys(record));
	const configKeys = new Set(Object.keys(config));
	const excessKeys = recordKeys.difference(configKeys);
	console.log(recordKeys, configKeys, excessKeys);
	if (excessKeys.size > 0) {
		return {
			type: "err",
			err: `Excess keys in record: ${[...excessKeys].join(", ")}`,
		};
	}

	type GenericLocale = {
		[id: string]:
			| GenericLocale
			| ((args: Record<string, FluentVariable>) => string)
			| ((args: Record<string, FluentVariable>) => Markdown);
	};

	const locale: GenericLocale = {};
	for (const [id, configValue] of Object.entries(config)) {
		const recordValue = record[id];

		if (configMessageSymbol in configValue) {
			if (recordValue?.type !== "message") {
				return {
					type: "err",
					err: `Expected message for key \`${id}\`, found: ${typeof recordValue}`,
				};
			}

			const message = recordValue.message;
			console.log(message);

			const pattern = message.value;
			if (pattern === null) {
				return {
					type: "err",
					err: `Pattern is null for message with ID: ${id}`,
				};
			}

			// validate placeables
			console.log(pattern);
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
									err: `Expected selector to be a var expression for key: ${id}; Found: ${selector.type}`,
								};
							}

							if (
								!Object.keys(configValue.placeables).includes(
									selector.name,
								)
							) {
								return {
									type: "err",
									err: `Found unexpected placeable name \`${selector.name}\` for key: ${id}`,
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
									err: `Found unexpected placeable name \`${element.name}\` for key: ${id}`,
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
					err: `Failed to compute variants for key \`${id}\`:\n${allVariantsRes.err}`,
				};
			}

			const allVariants = allVariantsRes.ok;
			console.log(allVariants);

			// create function
			const markdown = configValue.markdown;
			const compiledFnRes = ((): Result<
				| ((args?: Record<string, FluentVariable>) => string)
				| ((args?: Record<string, FluentVariable>) => Markdown),
				string
			> => {
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
								err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${id}\`:\n${markdownLiteralRes.err}`,
							};
						}

						const markdownLiteral = markdownLiteralRes.ok;
						const markdownRes = parseMarkdown(
							markdownLiteral,
							markdownSlots,
						);
						console.log(markdownRes);
						if (markdownRes.type === "err") {
							return {
								type: "err",
								err: `Invalid markdown for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${id}\`:\n${markdownRes.err}`,
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
							const res = parseMarkdown(
								markdownLiteral,
								markdownSlots,
							);

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
								err: `Invalid literal for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${id}\`:\n${stringLiteralRes.err}`,
							};
						}

						const stringLiteral = stringLiteralRes.ok;
						const stringRes = parseString(stringLiteral);
						console.log(stringRes);
						if (stringRes.type === "err") {
							return {
								type: "err",
								err: `Invalid string for variant \`${selectionChainToString(variant.selectionChain)}\` of key \`${id}\`:\n${stringRes.err}`,
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
			})();

			if (compiledFnRes.type === "err") {
				return compiledFnRes;
			}

			const compiledFn = compiledFnRes.ok;
			locale[id] = compiledFn;
		} else {
			if (recordValue?.type !== "subrecord") {
				return {
					type: "err",
					err: `Expected subrecord for key \`${id}\`, found: ${typeof recordValue}`,
				};
			}

			const subrecord = recordValue.subrecord;
			const compiledSubrecordRes = compileLocale({
				uncompiled: { bundle, record: subrecord },
				config: configValue,
			});

			if (compiledSubrecordRes.type === "err") {
				return {
					type: "err",
					err: `Error when compiling subrecord with key: \`${id}\`:\n${compiledSubrecordRes.err}`,
				};
			}

			const compiledSubrecord = compiledSubrecordRes.ok;
			locale[id] = compiledSubrecord;
		}
	}

	// SAFETY: validated above that all keys exist and are the correct type
	return { type: "ok", ok: locale as InferLocale<Config> };
}

function parseMessageLiteral(
	type: "string" | "md",
	message: string,
): Result<string, string> {
	const trimmedMessage = message.trim();

	console.log(trimmedMessage);

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

	console.log(stringStartIndex);
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
