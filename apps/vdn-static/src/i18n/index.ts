import en_US from "../locales/en_US";
import vp_VL from "../locales/vp_VL";
import wp_VL from "../locales/wp_VL";
import { computed, readonly, watch, type DeepReadonly } from "vue";
import { type Locale, type LocaleMask } from "./locale";
import { useLocalStorage } from "@vueuse/core";
import { type } from "arktype";
import { createI18n as createVueI18n, useI18n as useVueI18n } from "vue-i18n";
import {
	fallback,
	isSlot,
	isTemplate,
	type Fallback,
	type Template,
} from "./marker";
import { isRichT, type RichTemplate, type RichTemplatePart } from "./rich";
import type { SmartLinkProps } from "@/components/atoms/SmartLink";

// opaque type to stop people from accessing raw template string on accident
// and to track slot names used in the template for strict typing
const compiledTemplate: unique symbol = Symbol("compiledTemplate");
export type CompiledTemplate<SlotName extends string> = {
	[compiledTemplate]: true;
	template: string;
	slots: SlotName[];
};

type _CompileLocale<T> =
	T extends Template<infer SlotName> ? CompiledTemplate<SlotName>
	: T extends RichTemplate<infer SlotName> ? CompiledRichTemplate<SlotName>
	: { [K in keyof T]: _CompileLocale<T[K]> };
export type CompileLocale<T extends DeepPartialLocale<LocaleMask>> =
	_CompileLocale<T>;

type _DeepPartialLocale<T extends object> =
	T extends Template<string> ? T
	:	{ [K in keyof T]?: T[K] extends object ? _DeepPartialLocale<T[K]> : T[K] };
export type DeepPartialLocale<T extends LocaleMask> = _DeepPartialLocale<T>;

function compileLocale<const T extends DeepPartialLocale<LocaleMask>>(
	locale: T,
): CompileLocale<T> {
	return compileObject(locale, "");
}

function compileObject<const T extends Record<PropertyKey, unknown>>(
	obj: T,
	keypath: string,
): _CompileLocale<T> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			const entryKeypath = `${keypath}.${key}`;

			if (isTemplate(value)) {
				return [key, compileTemplate(value)] as const;
			}

			if (isRichT(value)) {
				return [key, compileRichTemplate(value, entryKeypath)] as const;
			}

			if (
				value !== null
				&& typeof value === "object"
				&& !Array.isArray(value)
			) {
				return [
					key,
					compileObject(
						value as Record<PropertyKey, unknown>,
						entryKeypath,
					),
				] as const;
			}

			return [key, value] as const;
		}),
	) as _CompileLocale<T>;
}

function compileTemplate<SlotName extends string>(
	template: Template<SlotName>,
): CompiledTemplate<SlotName> {
	const { parts } = template;

	let templateString = "";
	const slots: SlotName[] = [];
	for (const part of parts) {
		if (typeof part === "string") {
			templateString += part
				.split("")
				.map((c) => {
					if (c === "{" || c === "}" || c === "|") {
						return `{'${c}'}`;
					}

					return c;
				})
				.join("");

			continue;
		}

		templateString += `{${part.name}}`;
		slots.push(part.name);
	}

	return { [compiledTemplate]: true, template: templateString, slots };
}

function compileRichTemplate<SlotName extends string>(
	template: RichTemplate<SlotName>,
	keypath: string,
): CompiledRichTemplate<SlotName> {
	const { parts } = template;

	const { compiledParts, templateUuidToTemplate } =
		compileRichTemplateParts(parts);

	const slots: SlotName[] = [];

	return {
		[compiledRichTemplateSymbol]: true,
		keypath,
		parts: compiledParts,
		templateUuidToTemplate,
		slots,
	};
}

interface CompileRichTemplatePartRes<SlotName extends string> {
	compiledPart: CompiledRichTemplatePart;
	templateUuidToTemplate: Record<string, string>;
	slots: SlotName[];
}

function compileRichTemplatePart<SlotName extends string>(
	part: RichTemplatePart<SlotName>,
): CompileRichTemplatePartRes<SlotName> {
	if (typeof part === "string") {
		return { compiledPart: part, templateUuidToTemplate: {}, slots: [] };
	}

	if (isSlot(part)) {
		const templateString = `{${part.name}}`;
		const templateUuid = crypto.randomUUID();
		return {
			compiledPart: { type: "templateUuid", templateUuid },
			templateUuidToTemplate: { [templateUuid]: templateString },
			slots: [part.name],
		};
	}

	switch (part.type) {
		case "bold": {
			const { compiledParts, templateUuidToTemplate, slots } =
				compileRichTemplateParts(part.bold);

			return {
				compiledPart: { type: "bold", bold: compiledParts },
				templateUuidToTemplate,
				slots,
			};
		}
		case "italic": {
			const { compiledParts, templateUuidToTemplate, slots } =
				compileRichTemplateParts(part.italic);

			return {
				compiledPart: { type: "italic", italic: compiledParts },
				templateUuidToTemplate,
				slots,
			};
		}
		case "link": {
			const { compiledParts, templateUuidToTemplate, slots } =
				compileRichTemplateParts(part.link.children);

			return {
				compiledPart: {
					type: "link",
					link: { children: compiledParts, props: part.link.props },
				},
				templateUuidToTemplate,
				slots,
			};
		}
	}
}

interface CompileRichTemplatePartsRes<SlotName extends string> {
	compiledParts: CompiledRichTemplatePart[];
	templateUuidToTemplate: Record<string, string>;
	slots: SlotName[];
}

function compileRichTemplateParts<SlotName extends string>(
	parts: RichTemplatePart<SlotName>[],
): CompileRichTemplatePartsRes<SlotName> {
	const templateUuidToTemplate = {};
	const slots: SlotName[] = [];

	const compiledParts = parts.map((part) => {
		const res = compileRichTemplatePart(part);
		Object.assign(templateUuidToTemplate, res.templateUuidToTemplate);
		slots.push(...res.slots);
		return res.compiledPart;
	});

	return { compiledParts, templateUuidToTemplate, slots };
}

const compiledRichTemplateSymbol: unique symbol = Symbol(
	"compiledRichTemplate",
);
export interface CompiledRichTemplate<SlotName extends string> {
	[compiledRichTemplateSymbol]: true;
	keypath: string;
	parts: CompiledRichTemplatePart[];
	templateUuidToTemplate: Record<string, string>;
	slots: SlotName[];
}

export type CompiledRichTemplatePart =
	| string
	| { type: "templateUuid"; templateUuid: string }
	| { type: "bold"; bold: CompiledRichTemplatePart[] }
	| { type: "italic"; italic: CompiledRichTemplatePart[] }
	| {
			type: "link";
			link: {
				children: CompiledRichTemplatePart[];
				props: SmartLinkProps;
			};
	  };

export const LOCALE_IDS = ["en_US", "vp_VL", "wp_VL"] as const;

export type LocaleId = typeof LocaleId.infer;
export const LocaleId = type.enumerated(...LOCALE_IDS);

export const DEFAULT_LOCALE_ID = "en_US" satisfies LocaleId;

const localeIdToCompiledLocale = {
	en_US: compileLocale(en_US),
	vp_VL: compileLocale(vp_VL),
	wp_VL: compileLocale(wp_VL),
} as const satisfies { [DEFAULT_LOCALE_ID]: CompileLocale<Locale> } & Record<
	Exclude<LocaleId, typeof DEFAULT_LOCALE_ID>,
	CompileLocale<DeepPartialLocale<LocaleMask>>
>;

// users could manually edit localStorage to make this value anything, so we need to validate it
const localStorageLocaleId = useLocalStorage<unknown>(
	"localeId",
	DEFAULT_LOCALE_ID,
);

export const localeId = computed({
	get: (): LocaleId => {
		const localeIdRes = LocaleId(localStorageLocaleId.value);
		if (localeIdRes instanceof type.errors) {
			// if invalid LocaleId, reset to default
			localStorageLocaleId.value = DEFAULT_LOCALE_ID;
			return DEFAULT_LOCALE_ID;
		}

		// else return user's selection
		const localeId = localeIdRes;
		return localeId;
	},
	// custom setter to ensure it is only set to a valid LocaleId by our code
	// (since the localStorage ref is typed as `unknown`, it can be set to any value)
	set: (id: LocaleId) => {
		localStorageLocaleId.value = id;
	},
});

// export const useLocale = (opt: UseLocaleOptions = {}) => {
// 	const locale = computed<DeepReadonly<Locale>>(() => {
// 		return fallbackProxy<Locale>(
// 			locales[opt.locale ?? localeId.value],
// 			locales["en_US"],
// 		);
// 	});

// 	return readonly(locale);
// };

export interface UseLocaleOptions {
	locale?: LocaleId;
}

function isObject(value: unknown) {
	return typeof value === "object" && value !== null;
}

function deepReadonly<T>(value: T): DeepReadonly<T> {
	// SAFETY: we're just making an immutable view to the type, this isn't dangerous
	return value as DeepReadonly<T>;
}

type DeepFallbackable<T> = {
	[K in keyof T]?: DeepFallbackable<T[K]> | Fallback;
};

function fallbackProxy<Fallback extends object>(
	maskObj: DeepFallbackable<Fallback>,
	fallbackObj: Fallback,
): DeepReadonly<Fallback> {
	type Mask = typeof maskObj;
	const proxy = new Proxy(fallbackObj, {
		get: (_target, rawKey): DeepReadonly<Fallback[keyof Fallback]> => {
			// SAFETY: typescript should ensure we're only ever trying to access keys
			// 		   that exist on Fallback, and if the key doesn't,
			//         just process its fallback as if it did,
			//         everything should work as expected still
			const key = rawKey as keyof Fallback;

			// value may not exist on mask
			const maskValue: Mask[keyof Fallback] | undefined = maskObj[key];

			// all values exist on fallback
			const fallbackValue: Fallback[keyof Fallback] = fallbackObj[key];

			// this only handles the case where the current value is undefined, not nested ones.
			// thus, `finalValue` is still deeply partial (but not undefined or Fallback)
			const finalValue: Mask[keyof Fallback] =
				maskValue === undefined || maskValue === fallback ?
					fallbackValue
				:	maskValue;

			// check if finalValue is not an object
			// if not, it is a primitive
			if (!isObject(finalValue)) {
				// SAFETY: finalValue is not an object, so it is not affected by DeepPartial
				// 		   so `Mask[keyof Fallback]`  is the same as `Fallback[keyof Fallback]`
				return deepReadonly(finalValue as Fallback[keyof Fallback]);
			}

			// else, finalValue is an object, so we need to proxy it as well

			// check if fallbackValue is an object so that it can be used as finalValue's fallback
			if (!isObject(fallbackValue)) {
				// if not, we can't use finalValue as we'll have no fallback for it.
				// send the fallbackValue no matter what instead
				return deepReadonly(fallbackValue);
			}

			// else, proxy the returned object to support deep fallback proxying
			return fallbackProxy<Fallback[keyof Fallback] & object>(
				finalValue,
				fallbackValue,
			);
		},
		set: () => {
			throw new Error("Cannot mutate locale at runtime");
		},
	});

	// we're just disallowing mutations to the proxy, since its setter panics if used at runtime
	return deepReadonly(proxy);
}

const createLocale = (id: LocaleId) =>
	fallbackProxy<CompileLocale<Locale>>(
		localeIdToCompiledLocale[id],
		localeIdToCompiledLocale["en_US"],
	);

const createLocaleIdToMessages = (): Record<
	LocaleId,
	DeepReadonly<CompileLocale<Locale>>
> => {
	return {
		en_US: createLocale("en_US"),
		vp_VL: createLocale("vp_VL"),
		wp_VL: createLocale("wp_VL"),
	} as const;
};

const vueI18n = createVueI18n<[DeepReadonly<CompileLocale<Locale>>], LocaleId>({
	locale: localeId.value,
	messages: createLocaleIdToMessages(),
});

export const vueI18nPlugin = vueI18n;

watch(localeId, (id: LocaleId) => {
	vueI18n.global.locale = id;
});

// // TODO: eventually set up a lint to require this to be used with vue-i18n's t/$t
// export function tPath<const T extends StringResourcePath<Locale>>(path: T): T {
// 	return path;
// }

type StringResourcePath<T> = _StringResourcePath<T, ResourcePath<T>>;
type _StringResourcePath<T, TP extends ResourcePath<T>> =
	TP extends infer P extends ResourcePath<T> ?
		ResourceValue<T, P> extends string ?
			P
		:	never
	:	never;

type TemplateResourcePath<T> = _TemplateResourcePath<T, ResourcePath<T>>;
type _TemplateResourcePath<T, TP extends ResourcePath<T>> =
	TP extends infer P extends ResourcePath<T> ?
		ResourceValue<T, P> extends CompiledTemplate<string> ?
			P
		:	never
	:	never;

type RichTemplateResourcePath<
	T,
	SlotName extends string,
> = _RichTemplateResourcePath<T, ResourcePath<T>, SlotName>;
type _RichTemplateResourcePath<
	T,
	TP extends ResourcePath<T>,
	SlotName extends string,
> =
	TP extends infer P extends ResourcePath<T> ?
		ResourceValue<T, P> extends CompiledRichTemplate<SlotName> ?
			P
		:	never
	:	never;

// source: https://github.com/intlify/vue-i18n/issues/1116
// ---- Taken from https://github.com/intlify/vue-i18n/blob/v9.9.1/packages/core-base/src/types/utils.ts
type __ResourcePath<T, Key extends keyof T> =
	Key extends string ?
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		T[Key] extends Record<string, any> ?
			| `${Key}.${__ResourcePath<
					T[Key],
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					Exclude<keyof T[Key], keyof any[]>
			  >
					& string}`
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			| `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
		:	never
	:	never;
type _ResourcePath<T> = __ResourcePath<T, keyof T> | keyof T;
type ResourcePath<T> =
	_ResourcePath<T> extends string | keyof T ? _ResourcePath<T> : keyof T;

type ResourceValue<T, P extends ResourcePath<T>> =
	P extends `${infer Key}.${infer Rest}` ?
		Key extends keyof T ?
			Rest extends ResourcePath<T[Key]> ?
				ResourceValue<T[Key], Rest>
			:	never
		:	never
	: P extends keyof T ? T[P]
	: never;
// ----

// Currying to simplify the types
export type MessagePath = ResourcePath<CompileLocale<Locale>>;
export type StringMessagePath = StringResourcePath<CompileLocale<Locale>>;
export type TemplateMessagePath = TemplateResourcePath<CompileLocale<Locale>>;
export type RichTemplateMessagePath<SlotName extends string> =
	RichTemplateResourcePath<CompileLocale<Locale>, SlotName>;
export type MessageValue<Path extends ResourcePath<CompileLocale<Locale>>> =
	ResourceValue<CompileLocale<Locale>, Path>;

// type I18nType = typeof localeIdToVueI18n;
// type PatchedI18nType = Omit<I18nType, "global"> & {
// 	global: Omit<I18nType["global"], "tm"> & {
// 		// t(path: MessagePath, named?: NamedValue | string[]): string;

// 		tm<Path extends MessagePath>(
// 			path: Path,
// 			named?: NamedValue | string[],
// 		): MessageValue<Path>;
// 	};
// };

export interface I18nTOptions {
	locale?: LocaleId;
}

export interface I18nVOptions {
	locale?: LocaleId;
}

export const useI18n = () => {
	return readonly({
		t: (path: StringMessagePath, opt: I18nTOptions = {}): string => {
			const localLocaleId = opt.locale ?? localeId.value;
			return vueI18n.global.t(path, {}, { locale: localLocaleId });
		},
		v: <P extends MessagePath>(
			path: P,
			opt: I18nVOptions = {},
		): MessageValue<P> => {
			const localLocaleId = opt.locale ?? localeId.value;

			const localVueI18n = useVueI18n({ locale: localLocaleId });

			return localVueI18n.tm(path);
		},
	});
};

export const i18nPlugin = vueI18n;
