import { type Markdown } from "./markdown";

export const configMessageTypeSymbol: unique symbol =
	Symbol("configMessageType");

export const configStringSymbol: unique symbol = Symbol("configString");
export interface ConfigString<
	Placeables extends Partial<Record<string, ConfigPlaceableInfo>>,
> {
	[configMessageTypeSymbol]: typeof configStringSymbol;
	placeables: Placeables;
}

export const configMarkdownSymbol: unique symbol = Symbol("configMarkdown");
export interface ConfigMarkdown<
	Placeables extends Partial<Record<string, ConfigPlaceableInfo>>,
	Slots extends Partial<Record<string, ConfigSlotInfo>>,
> {
	[configMessageTypeSymbol]: typeof configMarkdownSymbol;
	placeables: Placeables;
	slots: Slots;
	bold?: boolean;
	italic?: boolean;
	header?: boolean;
	link?: boolean;
	ulist?: boolean;
}

export interface ConfigPlaceableInfo<
	Type extends "string" | "number" = "string" | "number",
> {
	type: Type;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConfigSlotInfo {}

export function string<
	const Placeables extends Partial<Record<string, ConfigPlaceableInfo>>,
>(
	opt: Omit<ConfigString<Placeables>, typeof configMessageTypeSymbol>,
): ConfigString<Placeables> {
	return { ...opt, [configMessageTypeSymbol]: configStringSymbol };
}

export function markdown<
	const Placeables extends Partial<Record<string, ConfigPlaceableInfo>>,
	const Slots extends Partial<Record<string, ConfigSlotInfo>>,
>(
	opt: Omit<
		ConfigMarkdown<Placeables, Slots>,
		typeof configMessageTypeSymbol
	>,
): ConfigMarkdown<Placeables, Slots> {
	return { ...opt, [configMessageTypeSymbol]: configMarkdownSymbol };
}

export type LocaleConfig = {
	[id: string]:
		| ConfigString<object>
		| ConfigMarkdown<object, object>
		| LocaleConfig;
};

type MessageCtx<
	Placeables extends Partial<Record<string, ConfigPlaceableInfo>>,
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

export type InferLocaleFromConfig<Config extends LocaleConfig> = {
	[K in keyof Config]: Config[K] extends LocaleConfig ?
		InferLocaleFromConfig<Config[K]>
	: Config[K] extends ConfigString<infer Placeables> ?
		object extends MessageCtx<Placeables> ?
			() => string
		:	(ctx: MessageCtx<Placeables>) => string
	: Config[K] extends ConfigMarkdown<infer Placeables, object> ?
		object extends MessageCtx<Placeables> ?
			() => Markdown
		:	(ctx: MessageCtx<Placeables>) => Markdown
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
