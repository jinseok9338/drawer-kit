import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  esbuild: {
    target: "node14",
  },

  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "src/test-ui/**", // Exclude test UI from coverage
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    // React version environment variable for testing
    env: {
      REACT_VERSION: "19",
    },
  },
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "src/drawer-kit"),
      "@test-ui": resolve(fileURLToPath(new URL(".", import.meta.url)), "src/test-ui"),
    },
  },
});
