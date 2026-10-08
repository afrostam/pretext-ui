import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves from /pretext-ui/ — set base path accordingly.
  // When using a custom domain this can be changed to "/".
  base: "/pretext-ui/",
});
