import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TextareaHTMLAttributes,
} from "react";
import { measureHeight } from "./pretext-helpers.js";

export interface AutoResizeInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  /** CSS font string matching the textarea's font, e.g. "16px Inter, sans-serif". */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Minimum number of visible lines. Default: 1. */
  minLines?: number;
  /** Maximum number of visible lines before scrolling. Default: Infinity. */
  maxLines?: number;
  /** Vertical padding inside the textarea (top + bottom). Default: 16. */
  verticalPadding?: number;
  /** Optional style for the textarea. */
  style?: CSSProperties;
  /** Callback when the computed height changes. */
  onHeightChange?: (height: number) => void;
}

/**
 * AutoResizeInput — a textarea that grows/shrinks as you type.
 *
 * Height is computed by pretext on every change — no hidden mirror element,
 * no scrollHeight measurement, zero layout thrash.
 */
export function AutoResizeInput({
  font,
  lineHeight,
  minLines = 1,
  maxLines = Infinity,
  verticalPadding = 16,
  style,
  onHeightChange,
  onChange,
  value: controlledValue,
  defaultValue,
  ...textareaProps
}: AutoResizeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalValue, setInternalValue] = useState(
    () => (controlledValue as string) ?? (defaultValue as string) ?? ""
  );
  const [width, setWidth] = useState(0);

  const currentValue = controlledValue !== undefined ? (controlledValue as string) : internalValue;

  // Track textarea width via ResizeObserver
  useEffect(() => {
    const el = textareaRef.current;
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

  // Compute height from text content
  const minHeight = minLines * lineHeight + verticalPadding;
  const maxHeight = maxLines === Infinity ? Infinity : maxLines * lineHeight + verticalPadding;

  let computedHeight = minHeight;
  if (width > 0) {
    // Subtract horizontal padding (border-box) — approximate with 16px
    const textWidth = Math.max(width - 16, 0);
    const textContent = currentValue || "";
    const measured = textContent
      ? measureHeight(textContent, font, textWidth, lineHeight)
      : 0;
    computedHeight = Math.min(
      Math.max(measured + verticalPadding, minHeight),
      maxHeight
    );
  }

  const prevHeightRef = useRef(computedHeight);
  useEffect(() => {
    if (computedHeight !== prevHeightRef.current) {
      prevHeightRef.current = computedHeight;
      onHeightChange?.(computedHeight);
    }
  }, [computedHeight, onHeightChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (controlledValue === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    },
    [controlledValue, onChange]
  );

  return (
    <textarea
      ref={textareaRef}
      value={currentValue}
      onChange={handleChange}
      {...textareaProps}
      style={{
        font,
        lineHeight: `${lineHeight}px`,
        resize: "none",
        overflow: computedHeight >= maxHeight ? "auto" : "hidden",
        height: computedHeight,
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}
