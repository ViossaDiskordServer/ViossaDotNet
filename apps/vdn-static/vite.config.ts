import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	plugins: [vue({})],
	resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
	server: { port: 1224 },
});
