import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/cedar-playground",
  build: {
    outDir: "dist/cedar-playground",
  },
  server: {
    fs: {
      allow: [".", "../cedar-playground-wasm/pkg"],
    },
  },
  plugins: [react(), wasm(), topLevelAwait()],
});
