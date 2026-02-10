import en_US from "../locales/en_US";
import vp_VL from "../locales/vp_VL";
import wp_VL from "../locales/wp_VL";
import { computed, readonly, type DeepReadonly } from "vue";
import type { Locale } from "./locale";
import type { DeepPartial } from "@/utils/deep-partial";
import { useLocalStorage } from "@vueuse/core";
import { type } from "arktype";

export const LOCALE_IDS = ["en_US", "vp_VL", "wp_VL"] as const;

export type LocaleId = typeof LocaleId.infer;
export const LocaleId = type.enumerated(...LOCALE_IDS);

export const DEFAULT_LOCALE_ID = "en_US" satisfies LocaleId;

const locales = { en_US, vp_VL, wp_VL } as const satisfies {
	en_US: Locale;
} & Record<Exclude<LocaleId, typeof DEFAULT_LOCALE_ID>, DeepPartial<Locale>>;

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

export const useLocale = (opt: UseLocaleOptions = {}) => {
	const locale = computed<DeepReadonly<Locale>>(() => {
		return fallbackProxy<Locale>(
			locales[opt.locale ?? localeId.value],
			locales["en_US"],
		);
	});

	return readonly(locale);
};

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

function fallbackProxy<T extends object>(
	mask: DeepPartial<T>,
	fallback: T,
): DeepReadonly<T> {
	const proxy = new Proxy(fallback, {
		get: (_target, key): DeepReadonly<T[keyof T]> => {
			// SAFETY: typescript should ensure we're only ever trying to access keys
			// 		   that exist on T, and if the key doesn't,
			//         just process its fallback as if it did,
			//         everything should work as expected still
			const tKey = key as keyof T;

			// value may not exist on mask
			const value: DeepPartial<T>[keyof T] | undefined = mask[tKey];

			// all values exist on fallback
			const fallbackValue: T[keyof T] = fallback[tKey];

			// this is *not* T[keyof T], because if value is an object,
			// it may still have missing properties.
			// this only handles the case where the current value is undefined, not nested ones.
			// thus, `finalValue` is still a `DeepPartial<T[keyof T]>` (but not undefined)
			const finalValue: DeepPartial<T>[keyof T] =
				value === undefined ? fallbackValue : value;

			// check if finalValue is not an object
			// if not, it is a primitive
			if (!isObject(finalValue)) {
				// SAFETY: finalValue is not an object, so it is not affected by DeepPartial
				// 		   so `DeepPartial<T>[keyof T]` is the same as `T[keyof T]`
				return deepReadonly(finalValue as T[keyof T]);
			}

			// else, finalValue is an object, so we need to proxy it as well

			// check if fallbackValue is an object so that it can be used as finalValue's fallback
			if (!isObject(fallbackValue)) {
				// if not, we can't use finalValue as we'll have no fallback for it.
				// send the fallbackValue no matter what instead
				return deepReadonly(fallbackValue);
			}

			// else, proxy the returned object to support deep fallback proxying
			return fallbackProxy<T[keyof T] & object>(
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
