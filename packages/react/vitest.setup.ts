// Polyfill OffscreenCanvas for pretext in the test env.
// pretext's getMeasureContext() tries OffscreenCanvas first, then falls back to DOM canvas.
// happy-dom ships an OffscreenCanvas whose getContext("2d") returns null, so we
// always replace it with one backed by @napi-rs/canvas.

import { createCanvas } from "@napi-rs/canvas";

class NapiOffscreenCanvas {
  width: number;
  height: number;
  private canvas: ReturnType<typeof createCanvas>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = createCanvas(width, height);
  }

  getContext(type: string) {
    return type === "2d" ? this.canvas.getContext("2d") : null;
  }
}

Object.defineProperty(globalThis, "OffscreenCanvas", {
  value: NapiOffscreenCanvas,
  writable: true,
  configurable: true,
});
