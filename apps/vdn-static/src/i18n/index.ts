import { createI18n } from "vue-i18n";
import en_US from "../locales/en_US";
import vp_VL from "../locales/vp_VL";
import type { MessageSchema } from "./types";

const locales = { en_US, vp_VL } as const;

export type Locale = keyof typeof locales;

const i18n = createI18n<[MessageSchema], Locale>({
	legacy: false,
	locale: "vp_VL" satisfies Locale,
	fallbackLocale: "en_US" satisfies Locale,
	messages: locales,
});

export default i18n;
