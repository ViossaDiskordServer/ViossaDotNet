import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({ history: createWebHistory(), routes: routes });
import i18n from './i18n'

createApp(App).use(i18n).use(router).mount("#app");
