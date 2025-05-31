import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes"
import i18n from './i18n'

createApp(App).use(i18n).use(router).mount("#app");
