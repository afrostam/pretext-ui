import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./index.css";

// Wait for fonts to load before rendering so pretext measures
// with the correct font metrics, not the fallback system font.
document.fonts.ready.then(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
