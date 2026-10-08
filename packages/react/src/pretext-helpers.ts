import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  measureLineStats as pretextMeasureLineStats,
  type PreparedText,
  type PreparedTextWithSegments,
  type PrepareOptions,
  type LayoutResult,
  type LayoutLinesResult,
  type LineStats,
} from "@chenglou/pretext";
import type { CSSProperties } from "react";

/**
 * Text options forwarded to pretext's prepare().
 *
 * `whiteSpace` defaults to `"pre-wrap"` because every pretext-ui component
 * renders text with `white-space: pre-wrap` — newlines and repeated spaces
 * are preserved, so measurement must preserve them too.
 */
export type TextOptions = PrepareOptions;

/** Cache of prepared text keyed by font + options + text. */
const preparedCache = new Map<string, PreparedText>();
const preparedWithSegmentsCache = new Map<string, PreparedTextWithSegments>();

function resolveOptions(options?: TextOptions): TextOptions {
  return {
    whiteSpace: options?.whiteSpace ?? "pre-wrap",
    wordBreak: options?.wordBreak,
    letterSpacing: options?.letterSpacing,
  };
}

function cacheKey(text: string, font: string, options: TextOptions): string {
  return `${font}\0${options.whiteSpace}\0${options.wordBreak ?? ""}\0${options.letterSpacing ?? 0}\0${text}`;
}

/**
 * Prepare text for layout (cached). This does segmentation + measurement
 * and is the expensive part — but only runs once per unique text+font+options.
 */
export function prepareCached(text: string, font: string, options?: TextOptions): PreparedText {
  const resolved = resolveOptions(options);
  const key = cacheKey(text, font, resolved);
  let prepared = preparedCache.get(key);
  if (!prepared) {
    prepared = prepare(text, font, resolved);
    preparedCache.set(key, prepared);
  }
  return prepared;
}

/**
 * Prepare text with segments (cached). Needed for line-level APIs.
 */
export function prepareWithSegmentsCached(
  text: string,
  font: string,
  options?: TextOptions
): PreparedTextWithSegments {
  const resolved = resolveOptions(options);
  const key = cacheKey(text, font, resolved);
  let prepared = preparedWithSegmentsCache.get(key);
  if (!prepared) {
    prepared = prepareWithSegments(text, font, resolved);
    preparedWithSegmentsCache.set(key, prepared);
  }
  return prepared;
}

/**
 * Measure the height of text at a given width using pretext's pure-arithmetic layout.
 * Returns the full LayoutResult (lineCount + height).
 */
export function measureText(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: TextOptions
): LayoutResult {
  return layout(prepareCached(text, font, options), maxWidth, lineHeight);
}

/**
 * Measure height only — the most common use case.
 */
export function measureHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: TextOptions
): number {
  return measureText(text, font, maxWidth, lineHeight, options).height;
}

/**
 * Line count and widest line at a given width, without building line strings.
 * Ideal for shrink-wrapping a container to its text.
 */
export function measureLineStats(
  text: string,
  font: string,
  maxWidth: number,
  options?: TextOptions
): LineStats {
  return pretextMeasureLineStats(prepareWithSegmentsCached(text, font, options), maxWidth);
}

/**
 * Layout text and return per-line info (text, width, cursors).
 */
export function measureLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: TextOptions
): LayoutLinesResult {
  return layoutWithLines(prepareWithSegmentsCached(text, font, options), maxWidth, lineHeight);
}

/**
 * CSS that renders text the same way pretext measured it.
 * Spread it onto the element holding the text so measurement and paint agree.
 */
export function textStyle(font: string, lineHeight: number, options?: TextOptions): CSSProperties {
  const resolved = resolveOptions(options);
  return {
    font,
    lineHeight: `${lineHeight}px`,
    whiteSpace: resolved.whiteSpace,
    overflowWrap: "break-word",
    wordBreak: resolved.wordBreak,
    letterSpacing: resolved.letterSpacing ? `${resolved.letterSpacing}px` : undefined,
  };
}

export function clearPreparedCache(): void {
  preparedCache.clear();
  preparedWithSegmentsCache.clear();
}
