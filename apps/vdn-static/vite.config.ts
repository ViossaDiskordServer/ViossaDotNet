import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueRouter from "unplugin-vue-router/vite";

export default defineConfig({
	plugins: [vueRouter({ root: "src", routesFolder: "pages" }), vue({})],
	resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
	server: { port: 1224 },
});
