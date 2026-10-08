import { describe, it, expect } from "vitest";
import {
  measureText,
  measureHeight,
  measureLines,
  measureLineStats,
  prepareCached,
  textStyle,
} from "./pretext-helpers.js";

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

describe("whitespace handling", () => {
  it("preserves newlines by default (pre-wrap), matching how components render", () => {
    const result = measureText("line1\nline2\nline3", FONT, 500, LINE_HEIGHT);
    expect(result.lineCount).toBe(3);
    expect(result.height).toBe(LINE_HEIGHT * 3);
  });

  it("preserves blank lines", () => {
    expect(measureText("a\n\nb", FONT, 500, LINE_HEIGHT).lineCount).toBe(3);
  });

  it("collapses newlines when whiteSpace is 'normal'", () => {
    const result = measureText("line1\nline2\nline3", FONT, 500, LINE_HEIGHT, { whiteSpace: "normal" });
    expect(result.lineCount).toBe(1);
  });

  it("caches per options, not just text + font", () => {
    const preWrap = prepareCached("a\nb", FONT);
    const normal = prepareCached("a\nb", FONT, { whiteSpace: "normal" });
    expect(preWrap).not.toBe(normal);
    expect(prepareCached("a\nb", FONT, { whiteSpace: "pre-wrap" })).toBe(preWrap);
  });

  it("treats an explicit undefined whiteSpace as the pre-wrap default", () => {
    expect(measureText("a\nb", FONT, 500, LINE_HEIGHT, { whiteSpace: undefined }).lineCount).toBe(2);
  });

  it("counts the caret line after a trailing newline when a space is appended", () => {
    // AutoResizeInput relies on this to match textarea behaviour.
    expect(measureText("abc\n", FONT, 500, LINE_HEIGHT).lineCount).toBe(1);
    expect(measureText("abc\n ", FONT, 500, LINE_HEIGHT).lineCount).toBe(2);
  });
});

describe("measureLineStats", () => {
  it("returns line count and the widest line", () => {
    const stats = measureLineStats("Hi\nLonger second line", FONT, 500);
    const lines = measureLines("Hi\nLonger second line", FONT, 500, LINE_HEIGHT).lines;
    expect(stats.lineCount).toBe(2);
    expect(stats.maxLineWidth).toBeCloseTo(Math.max(...lines.map((l) => l.width)));
  });

  it("never reports a line wider than maxWidth for wrapping text", () => {
    const stats = measureLineStats("word ".repeat(40), FONT, 150);
    expect(stats.lineCount).toBeGreaterThan(1);
    expect(stats.maxLineWidth).toBeLessThanOrEqual(150);
  });
});

describe("textStyle", () => {
  it("renders with the same whitespace mode pretext measured with", () => {
    expect(textStyle(FONT, LINE_HEIGHT).whiteSpace).toBe("pre-wrap");
    expect(textStyle(FONT, LINE_HEIGHT, { whiteSpace: "normal" }).whiteSpace).toBe("normal");
  });

  it("maps letterSpacing and wordBreak to CSS", () => {
    const style = textStyle(FONT, LINE_HEIGHT, { letterSpacing: 1.5, wordBreak: "keep-all" });
    expect(style.letterSpacing).toBe("1.5px");
    expect(style.wordBreak).toBe("keep-all");
    expect(style.lineHeight).toBe("24px");
  });
});
