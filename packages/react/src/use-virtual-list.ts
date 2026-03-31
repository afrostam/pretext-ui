import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { measureHeight } from "./pretext-helpers.js";

export interface VirtualListItem {
  /** Unique key for the item. */
  key: string;
  /** Text content to measure. */
  text: string;
}

export interface UseVirtualListOptions {
  /** All items in the list. */
  items: VirtualListItem[];
  /** CSS font string, e.g. "16px Inter, sans-serif". */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Vertical padding per row in px (top + bottom combined). */
  rowPadding?: number;
  /** How many rows to render beyond the visible area (above + below). */
  overscan?: number;
}

export interface VirtualRow {
  item: VirtualListItem;
  index: number;
  offsetTop: number;
  height: number;
}

export interface UseVirtualListResult {
  /** Ref to attach to the scrollable container. */
  containerRef: React.RefCallback<HTMLElement>;
  /** Total height of all rows (for the spacer element). */
  totalHeight: number;
  /** The visible (+ overscan) rows to render. */
  visibleRows: VirtualRow[];
  /** Offset from top for the rendered slice. */
  offsetY: number;
  /** Scroll handler to attach to the container. */
  onScroll: () => void;
}

/**
 * Hook that powers the VirtualList.
 * Uses pretext to compute exact row heights with pure arithmetic — no DOM measurement needed.
 */
export function useVirtualList(options: UseVirtualListOptions): UseVirtualListResult {
  const { items, font, lineHeight, rowPadding = 16, overscan = 5 } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerElRef = useRef<HTMLElement | null>(null);

  // Measure container via ResizeObserver
  const containerRef = useCallback((el: HTMLElement | null) => {
    containerElRef.current = el;
    if (el) {
      setContainerHeight(el.clientHeight);
      setContainerWidth(el.clientWidth);
    }
  }, []);

  useEffect(() => {
    const el = containerElRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const el = containerElRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  // Compute row heights + prefix sums using pretext
  const { rowHeights, prefixHeights, totalHeight } = useMemo(() => {
    if (containerWidth <= 0) {
      return { rowHeights: [] as number[], prefixHeights: [] as number[], totalHeight: 0 };
    }
    // Account for padding + borders inside the row when measuring text width.
    // Extra 4px buffer for cross-browser sub-pixel rounding differences.
    const textWidth = Math.max(containerWidth - 36, 0);
    const heights: number[] = new Array(items.length);
    const prefixes: number[] = new Array(items.length);
    let cumulative = 0;

    for (let i = 0; i < items.length; i++) {
      const textHeight = measureHeight(items[i].text, font, textWidth, lineHeight);
      // ceil + 2px buffer for cross-browser font rendering variance
      const rowH = Math.ceil(textHeight) + rowPadding + 2;
      heights[i] = rowH;
      prefixes[i] = cumulative;
      cumulative += rowH;
    }

    return { rowHeights: heights, prefixHeights: prefixes, totalHeight: cumulative };
  }, [items, font, lineHeight, rowPadding, containerWidth]);

  // Binary search for first visible row
  const visibleRows = useMemo((): VirtualRow[] => {
    if (items.length === 0 || containerWidth <= 0) return [];

    // Find first visible index via binary search on prefix heights
    let lo = 0;
    let hi = items.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (prefixHeights[mid] + rowHeights[mid] <= scrollTop) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    const startIdx = Math.max(0, lo - overscan);
    const rows: VirtualRow[] = [];
    const viewEnd = scrollTop + containerHeight;

    for (let i = startIdx; i < items.length; i++) {
      const offsetTop = prefixHeights[i];
      if (offsetTop > viewEnd + overscan * (rowHeights[i] || lineHeight)) break;

      rows.push({
        item: items[i],
        index: i,
        offsetTop,
        height: rowHeights[i],
      });
    }

    return rows;
  }, [items, scrollTop, containerHeight, containerWidth, prefixHeights, rowHeights, overscan, lineHeight]);

  const offsetY = visibleRows.length > 0 ? visibleRows[0].offsetTop : 0;

  return { containerRef, totalHeight, visibleRows, offsetY, onScroll };
}
