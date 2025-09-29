import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  root: "src/test-ui",
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "src/drawer-kit"),
      "@test-ui": resolve(fileURLToPath(new URL(".", import.meta.url)), "src/test-ui"),
    },
  },
  build: {
    outDir: "../../dist/test-ui",
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    open: true,
  },
});
