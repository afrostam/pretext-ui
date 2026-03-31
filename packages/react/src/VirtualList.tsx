import React, { type CSSProperties } from "react";
import { useVirtualList, type VirtualListItem, type VirtualRow } from "./use-virtual-list.js";

export interface VirtualListProps {
  /** All items to render. */
  items: VirtualListItem[];
  /** CSS font string matching the rendered text, e.g. "16px Inter, sans-serif". */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Vertical padding per row (top + bottom combined). Default: 16. */
  rowPadding?: number;
  /** Overscan rows beyond viewport. Default: 5. */
  overscan?: number;
  /** Render function for each row. */
  renderRow: (row: VirtualRow) => React.ReactNode;
  /** Optional className for the scroll container. */
  className?: string;
  /** Optional style for the scroll container. */
  style?: CSSProperties;
}

/**
 * VirtualList — infinite scroll with variable row heights calculated by pretext.
 *
 * Row heights are computed via pure arithmetic (no DOM reflow), making this
 * significantly faster than traditional virtual list implementations.
 */
export function VirtualList({
  items,
  font,
  lineHeight,
  rowPadding,
  overscan,
  renderRow,
  className,
  style,
}: VirtualListProps) {
  const { containerRef, totalHeight, visibleRows, offsetY, onScroll } = useVirtualList({
    items,
    font,
    lineHeight,
    rowPadding,
    overscan,
  });

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={className}
      style={{
        overflow: "auto",
        position: "relative",
        ...style,
      }}
    >
      {/* Spacer to make scrollbar reflect total content height */}
      <div style={{ height: totalHeight, pointerEvents: "none" }} />

      {/* Rendered rows, absolutely positioned */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${offsetY}px)`,
          willChange: "transform",
        }}
      >
        {visibleRows.map((row) => (
          <div key={row.item.key} style={{ height: row.height }}>
            {renderRow(row)}
          </div>
        ))}
      </div>
    </div>
  );
}
