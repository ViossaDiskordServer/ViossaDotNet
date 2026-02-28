import { compileLocale, type InferLocale } from "@/new-i18n-lib/config";
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
import miVlFtlSrc from "@/assets/locale/mi_VL.ftl";
import wpVlFtlSrc from "@/assets/locale/wp_VL.ftl";
import type { FluentBundle } from "@fluent/bundle";

export const LOCALE_IDS = ["en-US", "vp-VL", "mi-VL", "wp-VL"] as const; 

export type LocaleId = typeof LocaleId.infer;
export const LocaleId = type.enumerated(...LOCALE_IDS);

export const DEFAULT_LOCALE_ID = "en-US" satisfies LocaleId;

const localStorageLocaleId = useLocalStorage<unknown>(
	"localeId",
	DEFAULT_LOCALE_ID,
);

export const localeId = computed({
	get: (): LocaleId => {
		const localeIdRes = LocaleId(localStorageLocaleId.value);
		if (localeIdRes instanceof type.errors) {
			localStorageLocaleId.value = DEFAULT_LOCALE_ID;
			return DEFAULT_LOCALE_ID;
		}

		// else return user's selection
		const localeId = localeIdRes;
		return localeId;
	},
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

function setupLocale(
	localeBundle: FluentBundle,
	fallbackLocaleBundle: FluentBundle | undefined,
): Result<Locale, string> {
	const maybeFallbackedBundle = (() => {
		if (fallbackLocaleBundle === undefined) {
			return localeBundle;
		}

		console.log(localeBundle);
		console.log(fallbackLocaleBundle);

		const localeMessageIds = new Set(localeBundle._messages.keys());
		const fallbackMessageIds = new Set(
			fallbackLocaleBundle._messages.keys(),
		);

		const missingMessageIds =
			fallbackMessageIds.difference(localeMessageIds);

		for (const id of missingMessageIds) {
			const fallbackMessage = fallbackLocaleBundle._messages.get(id);
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

	const localeRes = compileLocale({ config: localeConfig, uncompiled });

	if (localeRes.type === "err") {
		return localeRes;
	}

	const locale = localeRes.ok;
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
	return value as DeepReadonly<T>;
}

const DEFAULT_LOCALE = unwrap(await loadLocale("en-US", enUsFtlSrc));

const doItAllForLocale = async (
	localeId: LocaleId,
	localeFtlSrc: string,
): Promise<DeepReadonly<Locale>> =>
	deepReadonly(
		unwrap(
			setupLocale(
				unwrap(await loadLocale(localeId, localeFtlSrc)),
				DEFAULT_LOCALE,
			),
		),
	);

const [vpVl, miVl, wpVl] = await Promise.all([
	doItAllForLocale("vp-VL", vpVlFtlSrc),
	doItAllForLocale("mi-VL", miVlFtlSrc),
	doItAllForLocale("wp-VL", wpVlFtlSrc),
]);

const localeIdToLocale = {
	"en-US": deepReadonly(unwrap(setupLocale(DEFAULT_LOCALE, DEFAULT_LOCALE))),
	"vp-VL": vpVl,
	"mi-VL": miVl,
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