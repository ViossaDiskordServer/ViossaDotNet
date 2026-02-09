import en_US from "../locales/en_US";
import vp_VL from "../locales/vp_VL";
import wp_VL from "../locales/wp_VL";
import { computed, readonly, ref, type DeepReadonly } from "vue";
import type { Locale } from "./locale";
import type { DeepPartial } from "@/utils/deep-partial";

export const LOCALE_IDS = ["en_US", "vp_VL", "wp_VL"] as const;
export type LocaleId = (typeof LOCALE_IDS)[number];

const locales = { en_US, vp_VL, wp_VL } as const satisfies {
	en_US: Locale;
} & Record<Exclude<LocaleId, "en_US">, DeepPartial<Locale>>;

export const localeId = ref<LocaleId>("en_US");

export function useLocale(opt: UseLocaleOptions = {}) {
	const locale = computed<DeepReadonly<Locale>>(() => {
		return fallbackProxy<Locale>(
			locales[opt.locale ?? localeId.value],
			locales["en_US"],
		);
	});

	return readonly(locale);
}

export interface UseLocaleOptions {
	locale?: LocaleId;
}

function isObject(value: unknown) {
	return value !== null && typeof value === "object";
}

function fallbackProxy<T extends object>(
	mask: DeepPartial<T>,
	fallback: T,
): DeepReadonly<T> {
	const proxy = new Proxy(fallback, {
		get: (_target, key): DeepReadonly<T[keyof T]> => {
			// SAFETY: typescript should ensure we're only ever trying to access keys
			// 		   that exist on T, and if the key doesn't, we'll be returning undefined anyway
			//         which is the expected behavior.
			const tKey = key as keyof T;

			// value may not exist on mask
			const value: DeepPartial<T>[keyof T] | undefined = mask[tKey];

			// all values exist on fallback
			const fallbackValue: T[keyof T] = fallback[tKey];

			// this is *not* T[keyof T], because if value is an object,
			// it may still have missing properties.
			// this only handles the case where the current value is undefined, not nested ones.
			// thus, `finalValue` is still a `DeepPartial<T[keyof T]>` (but not undefined)
			const finalValue: DeepPartial<T[keyof T]> =
				value === undefined ? fallbackValue : value;

			// check if finalValue or fallbackValue is not an object
			// (we can't deep proxy unless both of them are objects)
			if (!isObject(finalValue) || !isObject(fallbackValue)) {
				// SAFETY: finalValue is not an object,
				// 		   so `DeepPartial<typeof finalValue>` == `typeof finalValue`
				//         (it is a primitive type)
				//         then we apply DeepReadonly to disallow mutations and to satisfy
				//         the return type of this getter function
				return finalValue as DeepReadonly<T[keyof T]>;
			}

			// else, proxy the returned object to support deep fallback proxying
			return fallbackProxy<T[keyof T] & object>(
				// SAFETY: we validate that finalValue is an object above.
				// 		   I don't know why TypeScript isn't narrowing the type for us
				//		   based on that predicate, but oh well
				finalValue as DeepPartial<T[keyof T]> & object,
				fallbackValue,
			);
		},
		set: () => {
			throw new Error("Cannot mutate locale at runtime");
		},
	});

	// SAFETY: we're just disallowing mutations to the proxy,
	// 	       since its setter panics if used at runtime
	return proxy as DeepReadonly<T>;
}
