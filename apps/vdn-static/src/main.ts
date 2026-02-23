import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { bundleToUncompiledLocale, loadFluentBundle } from "./new-i18n/setup";

import enUsLocaleSrc from "@/assets/locale/en_US.ftl";
import { localeConfig, compileLocale } from "./new-i18n/config";
import { parseMarkdown } from "./new-i18n/markdown";

const bundleRes = await loadFluentBundle("en-US", enUsLocaleSrc);
if (bundleRes.type === "err") {
	throw new Error(bundleRes.err);
}

const bundle = bundleRes.ok;
const uncompiledRes = bundleToUncompiledLocale(bundle);
if (uncompiledRes.type === "err") {
	throw new Error(uncompiledRes.err);
}

const uncompiled = uncompiledRes.ok;

const localeRes = compileLocale({ config: localeConfig, uncompiled });
if (localeRes.type === "err") {
	throw new Error(localeRes.err);
}

const locale = localeRes.ok;
// console.log(locale.richTest.placeable({}));

const markdownRes = parseMarkdown("# [internal:#hello](Google)");
if (markdownRes.type === "err") {
	throw new Error(markdownRes.err);
}

const markdown = markdownRes.ok;
console.log(markdown);

console.log(uncompiled);

createApp(App).use(router).mount("#app");
