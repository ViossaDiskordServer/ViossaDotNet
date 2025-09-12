import en_US from "../locales/en_US";
import vp_VL from "../locales/vp_VL";
import { computed, readonly, ref } from "vue";
import type { Locale } from "./locale";

export const LOCALE_IDS = ["en_US", "vp_VL"] as const;
export type LocaleId = (typeof LOCALE_IDS)[number];

const locales = { en_US, vp_VL } as const satisfies Record<LocaleId, Locale>;

export const localeId = ref<LocaleId>("en_US");

export function useLocale(opt: UseLocaleOptions = {}) {
	const locale = computed<Locale>(() => {
		return fallbackProxy(
			locales[opt.locale ?? localeId.value],
			locales["en_US"],
		);
	});

	return readonly(locale);
}

export interface UseLocaleOptions {
	locale?: LocaleId;
}

function fallbackProxy(obj: any, fallback: any) {
	return new Proxy(obj, {
		get: (target, key) => {
			const value = target[key];
			const fallbackValue = fallback[key];
			if (value === undefined) {
				return fallbackValue;
			}

			if (value === null && fallbackValue !== null) {
				return fallbackValue;
			}

			if (
				value === null
				|| fallbackValue === null
				|| typeof value !== "object"
				|| typeof fallbackValue !== "object"
			) {
				return value;
			}

			return fallbackProxy(value, fallbackValue);
		},
		set: () => {
			throw new Error("Cannot mutate locale at runtime");
		},
	});
}
