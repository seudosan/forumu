import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");
const root = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir,
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: root },
      { find: "@/components", replacement: resolve(root, "components") },
    ],
  },
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
      },
    },
  },
});
