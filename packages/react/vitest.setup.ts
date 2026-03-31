// Polyfill OffscreenCanvas for pretext in Node/happy-dom test env.
// pretext's getMeasureContext() tries OffscreenCanvas first, then falls back to DOM canvas.
// happy-dom provides HTMLCanvasElement but getContext returns null.
// We polyfill OffscreenCanvas using @napi-rs/canvas.

import { createCanvas } from "@napi-rs/canvas";

if (typeof globalThis.OffscreenCanvas === "undefined") {
  // @ts-expect-error — minimal polyfill matching what pretext needs
  globalThis.OffscreenCanvas = class OffscreenCanvas {
    width: number;
    height: number;
    private canvas: ReturnType<typeof createCanvas>;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.canvas = createCanvas(width, height);
    }

    getContext(type: string) {
      if (type === "2d") {
        return this.canvas.getContext("2d");
      }
      return null;
    }
  };
}
