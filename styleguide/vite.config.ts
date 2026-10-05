import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = dirname(fileURLToPath(import.meta.url));

// The styleguide is a static page with relative paths, so it works under /design/ on the website
// and opened from any folder.
export default defineConfig({
  root: here,
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { outDir: join(here, "../dist-styleguide"), emptyOutDir: true },
});
