import { createRouter, createWebHistory } from "vue-router";
import { routes, handleHotUpdate } from "vue-router/auto-routes";

console.log(routes);

const router = createRouter({ history: createWebHistory(), routes });

if (import.meta.hot) {
	handleHotUpdate(router);
}

export default router;
