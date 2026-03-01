import { type InferLocale } from "@/new-i18n-lib/config";
import {
	bundleToUncompiledLocale,
	loadFluentBundle,
} from "@/new-i18n-lib/setup";
import { localeConfig } from "./config";
import type { Result } from "@/utils/types";
import { useLocalStorage } from "@vueuse/core";
import { computed, type DeepReadonly } from "vue";
import { type } from "arktype";
import enUsFtlSrc from "@/assets/locale/en_US.ftl";
import vpVlFtlSrc from "@/assets/locale/vp_VL.ftl";
import wpVlFtlSrc from "@/assets/locale/wp_VL.ftl";
import type { FluentBundle } from "@fluent/bundle";
import { compileLocale } from "@/new-i18n-lib/compile";

export const LOCALE_IDS = ["en-US", "vp-VL", "wp-VL"] as const;

export type LocaleId = typeof LocaleId.infer;
export const LocaleId = type.enumerated(...LOCALE_IDS);

export const DEFAULT_LOCALE_ID = "en-US" satisfies LocaleId;

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

export interface Locale extends InferLocale<typeof localeConfig> {}

async function loadLocale(
	localeId: LocaleId,
	localeFtlSrc: string,
): Promise<Result<FluentBundle, string>> {
	const bundleRes = await loadFluentBundle(localeId, localeFtlSrc);
	if (bundleRes.type === "err") {
		return bundleRes;
	}

	const bundle = bundleRes.ok;
	return { type: "ok", ok: bundle };
}

interface SetupLocaleFallback {
	bundle: FluentBundle;
	locale: Locale;
}

function setupLocale(
	localeBundle: FluentBundle,
	fallback: SetupLocaleFallback | undefined,
): Result<Locale, string> {
	const fallbackBundle = fallback?.bundle;
	const fallbackLocale = fallback?.locale;

	const maybeFallbackedBundle = (() => {
		if (fallbackBundle === undefined) {
			return localeBundle;
		}

		const localeMessageIds = new Set(localeBundle._messages.keys());
		const fallbackMessageIds = new Set(fallbackBundle._messages.keys());

		const missingMessageIds =
			fallbackMessageIds.difference(localeMessageIds);

		for (const id of missingMessageIds) {
			const fallbackMessage = fallbackBundle._messages.get(id);
			if (fallbackMessage) {
				localeBundle._messages.set(id, fallbackMessage);
			}
		}

		return localeBundle;
	})();

	const uncompiledRes = bundleToUncompiledLocale(maybeFallbackedBundle);
	if (uncompiledRes.type === "err") {
		return uncompiledRes;
	}

	const uncompiled = uncompiledRes.ok;

	const localeRes = compileLocale({
		config: localeConfig,
		bundle: uncompiled.bundle,
		record: uncompiled.record,
		fallback: fallbackLocale,
	});

	console.error(localeRes.errors);

	const locale = localeRes.locale;
	return { type: "ok", ok: locale };
}

function unwrap<T, E>(result: Result<T, E>): T {
	switch (result.type) {
		case "ok": {
			return result.ok;
		}
		case "err": {
			throw new Error(String(result.err));
		}
	}
}

function deepReadonly<T>(value: T): DeepReadonly<T> {
	// SAFETY: we're just making an immutable view to the type, this isn't dangerous
	return value as DeepReadonly<T>;
}

const DEFAULT_LOCALE_BUNDLE = unwrap(await loadLocale("en-US", enUsFtlSrc));
const DEFAULT_LOCALE = unwrap(setupLocale(DEFAULT_LOCALE_BUNDLE, undefined));

const doItAllForLocale = async (
	localeId: LocaleId,
	localeFtlSrc: string,
): Promise<DeepReadonly<Locale>> =>
	deepReadonly(
		unwrap(
			setupLocale(unwrap(await loadLocale(localeId, localeFtlSrc)), {
				bundle: DEFAULT_LOCALE_BUNDLE,
				locale: DEFAULT_LOCALE,
			}),
		),
	);

const [vpVl, wpVl] = await Promise.all([
	doItAllForLocale("vp-VL", vpVlFtlSrc),
	doItAllForLocale("wp-VL", wpVlFtlSrc),
]);

const localeIdToLocale = {
	"en-US": deepReadonly(DEFAULT_LOCALE),
	"vp-VL": vpVl,
	"wp-VL": wpVl,
} as const satisfies Record<LocaleId, DeepReadonly<Locale>>;

export interface UseLocaleOptions {
	locale?: LocaleId;
}

export const useLocale = (opt: UseLocaleOptions = {}) =>
	computed<DeepReadonly<Locale>>(() => {
		const localLocaleId = opt.locale ?? localeId.value;
		return localeIdToLocale[localLocaleId];
	});
