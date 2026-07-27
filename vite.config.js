import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Astrology-app/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        result: resolve(__dirname, "result.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});