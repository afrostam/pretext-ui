import { describe, it, expect } from "vitest";
import { measureText, measureHeight, measureLines } from "./pretext-helpers.js";

const FONT = "16px sans-serif";
const LINE_HEIGHT = 24;

describe("measureText", () => {
  it("returns lineCount and height for single-line text", () => {
    const result = measureText("Hello", FONT, 500, LINE_HEIGHT);
    expect(result.lineCount).toBe(1);
    expect(result.height).toBe(LINE_HEIGHT);
  });

  it("wraps text at narrow widths", () => {
    const longText = "This is a longer sentence that should wrap at narrow widths";
    const wide = measureText(longText, FONT, 1000, LINE_HEIGHT);
    const narrow = measureText(longText, FONT, 100, LINE_HEIGHT);
    expect(narrow.lineCount).toBeGreaterThan(wide.lineCount);
    expect(narrow.height).toBeGreaterThan(wide.height);
  });

  it("handles empty string", () => {
    const result = measureText("", FONT, 500, LINE_HEIGHT);
    // pretext returns 0 lines for empty text
    expect(result.lineCount).toBe(0);
    expect(result.height).toBe(0);
  });

  it("height scales with line height", () => {
    const text = "Hello world";
    const h24 = measureText(text, FONT, 500, 24);
    const h48 = measureText(text, FONT, 500, 48);
    expect(h48.height).toBe(h24.height * 2);
  });
});

describe("measureHeight", () => {
  it("returns just the height number", () => {
    const h = measureHeight("Hello", FONT, 500, LINE_HEIGHT);
    expect(typeof h).toBe("number");
    expect(h).toBe(LINE_HEIGHT);
  });
});

describe("measureLines", () => {
  it("returns per-line info", () => {
    const result = measureLines("Hello world", FONT, 500, LINE_HEIGHT);
    expect(result.lines.length).toBe(1);
    expect(result.lines[0].text).toBe("Hello world");
    expect(result.lines[0].width).toBeGreaterThan(0);
  });

  it("wrapping produces multiple lines with positive widths", () => {
    const result = measureLines(
      "This is a longer sentence that will definitely need to wrap when given a narrow container width",
      FONT,
      120,
      LINE_HEIGHT,
    );
    expect(result.lines.length).toBeGreaterThan(1);
    for (const line of result.lines) {
      expect(line.width).toBeGreaterThan(0);
    }
  });
});
