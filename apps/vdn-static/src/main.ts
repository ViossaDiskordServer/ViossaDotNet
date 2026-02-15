import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { vueI18nPlugin } from "./i18n";

createApp(App).use(router).use(vueI18nPlugin).mount("#app");
