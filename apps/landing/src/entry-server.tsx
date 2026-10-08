import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.js";

/** Used at build time to prerender the landing page into static HTML. */
export function render(): string {
  return renderToString(<App />);
}
