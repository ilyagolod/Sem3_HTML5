import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/css/global/reset.scss"; @import "@/assets/css/global/grid.scss";`,
            },
        },
    },

    resolve: {
        alias: {
          "@": resolve(__dirname, "./src"),
        },
      },
});
