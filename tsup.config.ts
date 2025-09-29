import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/drawer-kit/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  external: ["react", "react-dom", "vaul"],
  esbuildOptions(options) {
    // React 19 compatibility
    options.jsx = "automatic";
    options.jsxImportSource = "react";
  },
  onSuccess: async () => {
    console.log("✅ Library build completed successfully!");
  },
  env: {
    NODE_ENV: "production",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});


