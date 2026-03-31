import React, { useMemo, useState, useCallback, useRef, useEffect, type CSSProperties } from "react";
import { measureHeight } from "./pretext-helpers.js";

export interface MasonryItem {
  key: string;
  text: string;
  /** Optional: override the font for this specific card. */
  font?: string;
}

export interface MasonryCardLayout {
  item: MasonryItem;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MasonryGridProps {
  items: MasonryItem[];
  /** CSS font string, e.g. "14px Inter, sans-serif". */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Number of columns. Default: 3. */
  columns?: number;
  /** Gap between cards in px. Default: 16. */
  gap?: number;
  /** Vertical padding inside each card (top + bottom). Default: 24. */
  cardPadding?: number;
  /** Horizontal padding inside each card (left + right). Default: 24. */
  cardHorizontalPadding?: number;
  /** Render function for each card. */
  renderCard: (layout: MasonryCardLayout) => React.ReactNode;
  /** Optional className for the grid container. */
  className?: string;
  /** Optional style for the grid container. */
  style?: CSSProperties;
}

/**
 * Compute masonry layout positions using pretext for card heights.
 * All measurement is pure arithmetic — no DOM reads.
 */
export function useMasonryLayout(options: {
  items: MasonryItem[];
  font: string;
  lineHeight: number;
  columns: number;
  gap: number;
  cardPadding: number;
  cardHorizontalPadding: number;
  containerWidth: number;
}): { cards: MasonryCardLayout[]; totalHeight: number } {
  const {
    items,
    font,
    lineHeight,
    columns,
    gap,
    cardPadding,
    cardHorizontalPadding,
    containerWidth,
  } = options;

  return useMemo(() => {
    if (containerWidth <= 0 || columns <= 0) {
      return { cards: [], totalHeight: 0 };
    }

    const cardWidth = (containerWidth - gap * (columns - 1)) / columns;
    const textWidth = Math.max(cardWidth - cardHorizontalPadding, 0);

    // Track the bottom edge of each column
    const columnHeights = new Array<number>(columns).fill(0);
    const cards: MasonryCardLayout[] = [];

    for (const item of items) {
      // Find the shortest column
      let shortestCol = 0;
      for (let c = 1; c < columns; c++) {
        if (columnHeights[c] < columnHeights[shortestCol]) {
          shortestCol = c;
        }
      }

      const itemFont = item.font || font;
      const textH = item.text
        ? measureHeight(item.text, itemFont, textWidth, lineHeight)
        : lineHeight;
      // ceil + 2px buffer to account for cross-browser font rendering differences
      const cardHeight = Math.ceil(textH) + cardPadding + 2;

      const x = shortestCol * (cardWidth + gap);
      const y = columnHeights[shortestCol];

      cards.push({
        item,
        column: shortestCol,
        x,
        y,
        width: cardWidth,
        height: cardHeight,
      });

      columnHeights[shortestCol] += cardHeight + gap;
    }

    const totalHeight = Math.max(...columnHeights) - gap;
    return { cards, totalHeight: Math.max(totalHeight, 0) };
  }, [items, font, lineHeight, columns, gap, cardPadding, cardHorizontalPadding, containerWidth]);
}

/**
 * MasonryGrid — Pinterest-style card layout without DOM reads.
 *
 * Card heights are computed by pretext, then placed into the shortest column.
 * The entire layout is pure arithmetic.
 */
export function MasonryGrid({
  items,
  font,
  lineHeight,
  columns = 3,
  gap = 16,
  cardPadding = 24,
  cardHorizontalPadding = 24,
  renderCard,
  className,
  style,
}: MasonryGridProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { cards, totalHeight } = useMasonryLayout({
    items,
    font,
    lineHeight,
    columns,
    gap,
    cardPadding,
    cardHorizontalPadding,
    containerWidth,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        ...style,
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {cards.map((card) => (
          <div
            key={card.item.key}
            style={{
              position: "absolute",
              left: card.x,
              top: card.y,
              width: card.width,
              height: card.height,
            }}
          >
            {renderCard(card)}
          </div>
        ))}
      </div>
    </div>
  );
}
