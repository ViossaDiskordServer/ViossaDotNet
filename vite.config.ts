import { defineConfig } from "vite";
import { fileURLToPath, URL } from 'node:url'
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import vueRouter from "unplugin-vue-router/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vueRouter({ routesFolder: "src/routes", dts: "src/typed-router.d.ts" }),
    vue(),
  ],
  build: {
    outDir: "/var/www/viossa.net",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
