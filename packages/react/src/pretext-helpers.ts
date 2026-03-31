import { prepare, layout, type PreparedText, type LayoutResult } from "@chenglou/pretext";

/** Cache of prepared text keyed by `text + font`. */
const preparedCache = new Map<string, PreparedText>();

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

export function clearPreparedCache(): void {
  preparedCache.clear();
}
