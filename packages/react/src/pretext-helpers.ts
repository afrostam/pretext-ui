import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  type PreparedText,
  type PreparedTextWithSegments,
  type LayoutResult,
  type LayoutLinesResult,
} from "@chenglou/pretext";

/** Cache of prepared text keyed by `text + font`. */
const preparedCache = new Map<string, PreparedText>();
const preparedWithSegmentsCache = new Map<string, PreparedTextWithSegments>();

function cacheKey(text: string, font: string): string {
  return `${font}\0${text}`;
}

/**
 * Prepare text for layout (cached). This does segmentation + measurement
 * and is the expensive part — but only runs once per unique text+font pair.
 */
export function prepareCached(text: string, font: string): PreparedText {
  const key = cacheKey(text, font);
  let prepared = preparedCache.get(key);
  if (!prepared) {
    prepared = prepare(text, font);
    preparedCache.set(key, prepared);
  }
  return prepared;
}

/**
 * Prepare text with segments (cached). Needed for layoutWithLines / walkLineRanges.
 */
export function prepareWithSegmentsCached(text: string, font: string): PreparedTextWithSegments {
  const key = cacheKey(text, font);
  let prepared = preparedWithSegmentsCache.get(key);
  if (!prepared) {
    prepared = prepareWithSegments(text, font);
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
  lineHeight: number
): LayoutResult {
  const prepared = prepareCached(text, font);
  return layout(prepared, maxWidth, lineHeight);
}

/**
 * Measure height only — the most common use case.
 */
export function measureHeight(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): number {
  return measureText(text, font, maxWidth, lineHeight).height;
}

/**
 * Layout text and return per-line info (text, width, cursors).
 * Uses prepareWithSegments under the hood.
 */
export function measureLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number
): LayoutLinesResult {
  const prepared = prepareWithSegmentsCached(text, font);
  return layoutWithLines(prepared, maxWidth, lineHeight);
}

export function clearPreparedCache(): void {
  preparedCache.clear();
  preparedWithSegmentsCache.clear();
}
