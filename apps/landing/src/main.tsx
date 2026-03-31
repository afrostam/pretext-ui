import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./index.css";

// Wait for fonts to load before rendering — pretext needs the correct
// font metrics for accurate measurement. Without this, a hard refresh
// causes pretext to measure with the fallback system font, then Inter
// loads and text reflows with different line breaks.
document.fonts.ready.then(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
