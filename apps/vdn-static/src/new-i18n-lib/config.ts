import { type Markdown } from "./markdown";

export const configMessageSymbol: unique symbol = Symbol("configMessage");
export interface ConfigMessage<
	Placeables extends { [name in string]?: ConfigPlaceableInfo } = object,
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
