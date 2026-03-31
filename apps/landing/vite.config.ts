import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /pretext-ui/ — set base path accordingly.
  // When using a custom domain this can be changed to "/".
  base: "/pretext-ui/",
});
