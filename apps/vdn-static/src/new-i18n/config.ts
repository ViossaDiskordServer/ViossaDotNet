import type { Result } from "@/utils/types";
import {
	computeAllVariants,
	type L10nRecord,
	type UncompiledLocale,
} from "./setup";
import type { FluentVariable } from "@fluent/bundle";

export const configMessageSymbol: unique symbol = Symbol("configMessage");
export interface ConfigMessage<
	Slot extends string = string,
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = {
		[name in string]: ConfigPlaceableInfo;
	},
	Markdown extends ConfigMarkdown = ConfigMarkdown,
> {
	[configMessageSymbol]: true;
	slots: Slot[];
	placeables: Placeables;
	markdown: Markdown;
}

export interface ConfigPlaceableInfo<
	Type extends "string" | "number" = "string" | "number",
> {
	type: Type;
}

export interface ConfigMarkdown<Bold extends boolean = boolean> {
	bold?: Bold;
}

function message<
	const Slot extends string = never,
	const Placeables extends {
		[name in string]?: ConfigPlaceableInfo;
	} = object,
	const Markdown extends ConfigMarkdown = object,
>(
	opt: Partial<
		Omit<
			ConfigMessage<Slot, Placeables, Markdown>,
			typeof configMessageSymbol
		>
	> = {},
): ConfigMessage<Slot, Placeables, Markdown> {
	return {
		[configMessageSymbol]: true,
		slots: opt.slots ?? [],
		placeables: opt.placeables ?? {},
		markdown: opt.markdown ?? {},
	};
}

type LocaleConfig<
	Slot extends string = string,
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = object,
	Markdown extends ConfigMarkdown = object,
> = {
	[id: string]:
		| ConfigMessage<Slot, Placeables, Markdown>
		| LocaleConfig<Slot, Placeables, Markdown>;
};

type MessageCtx<
	Slot extends string = string,
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

type InferLocale<Config extends LocaleConfig> = {
	[K in keyof Config]: Config[K] extends LocaleConfig ? InferLocale<Config[K]>
	: Config[K] extends ConfigMessage<infer Slot, infer Placeables> ?
		object extends MessageCtx<Slot, Placeables> ?
			() => string
		:	(ctx: MessageCtx<Slot, Placeables>) => string
	:	never;
};

const homeSectionConfig = { title: message(), body: message() };

const imageConfig = { alt: message() };

export const localeConfig = {
	localeName: message(),
	vilanticLangs: { viossa: message(), wodox: message() },
	navbar: {
		whatIsViossa: message(),
		resources: message(),
		kotoba: message(),
	},
	home: {
		sections: {
			whatIsViossa: homeSectionConfig,
			historyOfViossa: homeSectionConfig,
			community: homeSectionConfig,
		},
		images: { viossaFlag: imageConfig },
	},
	richTest: {
		slot: message({ slots: ["slot"] }),
		placeable: message({
			placeables: {
				wow: { type: "string" },
				placeable: { type: "number" },
			},
		}),
		bold: message({ markdown: { bold: true } }),
	},
} as const satisfies LocaleConfig;

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
			| ((args: Record<string, FluentVariable>) => string);
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

			const allVariants = computeAllVariants(pattern);
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

			// check if all variants are valid markdown

			// create function
			locale[id] = (args: Record<string, FluentVariable> = {}) =>
				// TODO: will need to make sure markdown/slots are escapes when inserting variable values
				bundle.formatPattern(pattern, args);
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
