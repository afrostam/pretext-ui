import React, { useEffect, useRef, useState, useMemo, type CSSProperties } from "react";
import { measureHeight } from "./pretext-helpers.js";

export interface StreamingTextProps {
  /** The text content so far (grows as tokens stream in). */
  text: string;
  /** CSS font string matching the rendered text. */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Whether text is still streaming. Drives the cursor animation. */
  isStreaming?: boolean;
  /** Optional className for the outer container. */
  className?: string;
  /** Optional style for the outer container. */
  style?: CSSProperties;
  /** Optional className for the text element. */
  textClassName?: string;
  /** Callback when the computed height changes. */
  onHeightChange?: (height: number) => void;
}

/**
 * StreamingText — renders AI-streamed text without layout shift.
 *
 * As tokens arrive, pretext computes the exact height the text will occupy.
 * The container is pre-sized to that height, so surrounding layout never shifts.
 * A blinking cursor shows while streaming is active.
 */
export function StreamingText({
  text,
  font,
  lineHeight,
  isStreaming = false,
  className,
  style,
  textClassName,
  onHeightChange,
}: StreamingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const computedHeight = useMemo(() => {
    if (width <= 0) return lineHeight;
    if (!text) return lineHeight;
    return measureHeight(text, font, width, lineHeight);
  }, [text, font, lineHeight, width]);

  const prevHeightRef = useRef(computedHeight);
  useEffect(() => {
    if (computedHeight !== prevHeightRef.current) {
      prevHeightRef.current = computedHeight;
      onHeightChange?.(computedHeight);
    }
  }, [computedHeight, onHeightChange]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: computedHeight,
        transition: "height 50ms ease-out",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        className={textClassName}
        style={{
          font,
          lineHeight: `${lineHeight}px`,
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {text}
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              backgroundColor: "currentColor",
              marginLeft: "1px",
              verticalAlign: "text-bottom",
              animation: "pretext-ui-blink 1s step-end infinite",
            }}
          />
        )}
      </div>
      {isStreaming && (
        <style>{`@keyframes pretext-ui-blink { 50% { opacity: 0; } }`}</style>
      )}
    </div>
  );
}
