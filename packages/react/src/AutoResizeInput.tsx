import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TextareaHTMLAttributes,
} from "react";
import { measureHeight, textStyle, type TextOptions } from "./pretext-helpers.js";

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
  /** pretext text options (wordBreak, letterSpacing). Textareas always preserve whitespace. */
  textOptions?: Omit<TextOptions, "whiteSpace">;
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
  textOptions,
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

  // Track the textarea's content-box width (excludes padding) via ResizeObserver,
  // which also fires once on observe with the initial size.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
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
    // A textarea shows an empty caret line after a trailing newline; a div
    // (which pretext models) doesn't. A trailing space makes them agree.
    const textContent = currentValue.endsWith("\n") ? `${currentValue} ` : currentValue;
    const measured = textContent
      ? measureHeight(textContent, font, width, lineHeight, { ...textOptions, whiteSpace: "pre-wrap" })
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
        ...textStyle(font, lineHeight, textOptions),
        resize: "none",
        overflow: computedHeight >= maxHeight ? "auto" : "hidden",
        height: computedHeight,
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}
