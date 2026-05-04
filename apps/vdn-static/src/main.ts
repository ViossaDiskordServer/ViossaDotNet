import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { onI18nInit } from "./i18n";

onI18nInit(() => {
	createApp(App).use(router).mount("#app");
});
