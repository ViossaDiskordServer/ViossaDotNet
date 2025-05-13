import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import "bulma/css/bulma.css";

const router = createRouter({ history: createWebHistory(), routes: routes });

createApp(App).use(router).mount("#app");
