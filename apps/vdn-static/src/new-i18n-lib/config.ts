import type { Result } from "@/utils/types";
import {
	computeAllVariants,
	selectionChainToString,
	type UncompiledLocale,
} from "./setup";
import type { FluentVariable } from "@fluent/bundle";
import { parseMarkdown, type Markdown } from "./markdown";

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

			const allVariantsRes = computeAllVariants(pattern);
			if (allVariantsRes.type === "err") {
				return {
					type: "err",
					err: `Failed to compute variants for key \`${id}\`:\n${allVariantsRes.err}`,
				};
			}

			const allVariants = allVariantsRes.ok;
			console.log(allVariants);

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

			// create function
			const markdown = configValue.markdown;
			const compiledFnRes = ((): Result<
				| ((args?: Record<string, FluentVariable>) => string)
				| ((args?: Record<string, FluentVariable>) => Markdown),
				string
			> => {
				if (markdown !== null) {
					const markdownSlots = markdown.slots ?? [];

					// check if all variants are valid markdown
					for (const variant of allVariants) {
						const markdownRes = parseMarkdown(
							variant.string,
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
							const res = parseMarkdown(
								bundle.formatPattern(pattern, args),
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
					// TODO: will need to make sure markdown/slots are escapes when inserting variable values
					return {
						type: "ok",
						ok: (args: Record<string, FluentVariable> = {}) =>
							bundle.formatPattern(pattern, args),
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
