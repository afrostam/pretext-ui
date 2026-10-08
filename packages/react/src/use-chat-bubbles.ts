import { useMemo } from "react";
import { measureLineStats, type TextOptions } from "./pretext-helpers.js";

export interface ChatMessage {
  key: string;
  text: string;
  sender: "self" | "other";
  timestamp?: string;
}

export interface BubbleLayout {
  message: ChatMessage;
  /** Computed width of the bubble (including padding) in px. */
  bubbleWidth: number;
  /** Computed height of the text content in px. */
  textHeight: number;
  /** Number of text lines. */
  lineCount: number;
}

export interface UseChatBubblesOptions {
  messages: ChatMessage[];
  /** CSS font string, e.g. "14px Inter, sans-serif". */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Maximum bubble width in px. */
  maxBubbleWidth: number;
  /** Minimum bubble width in px. Default: 48. */
  minBubbleWidth?: number;
  /** Horizontal padding inside the bubble (left + right). Default: 24. */
  horizontalPadding?: number;
  /** pretext text options (whiteSpace, wordBreak, letterSpacing). */
  textOptions?: TextOptions;
}

/**
 * Compute tight-fit bubble layouts using pretext.
 *
 * For each message, measures line stats at maxWidth and shrink-wraps the
 * bubble to the widest line. All pure arithmetic — no DOM.
 */
export function useChatBubbles(options: UseChatBubblesOptions): BubbleLayout[] {
  const {
    messages,
    font,
    lineHeight,
    maxBubbleWidth,
    minBubbleWidth = 48,
    horizontalPadding = 24,
    textOptions,
  } = options;
  const { whiteSpace, wordBreak, letterSpacing } = textOptions ?? {};

  return useMemo(() => {
    const maxTextWidth = Math.max(maxBubbleWidth - horizontalPadding, 0);
    const opts: TextOptions = { whiteSpace, wordBreak, letterSpacing };

    return messages.map((message): BubbleLayout => {
      if (!message.text) {
        return { message, bubbleWidth: minBubbleWidth, textHeight: lineHeight, lineCount: 1 };
      }

      const { lineCount, maxLineWidth } = measureLineStats(message.text, font, maxTextWidth, opts);

      // Shrink-wrap: bubble is only as wide as its widest line + padding
      const bubbleWidth = Math.max(
        minBubbleWidth,
        Math.min(Math.ceil(maxLineWidth) + horizontalPadding, maxBubbleWidth)
      );

      return { message, bubbleWidth, textHeight: lineCount * lineHeight, lineCount };
    });
  }, [messages, font, lineHeight, maxBubbleWidth, minBubbleWidth, horizontalPadding, whiteSpace, wordBreak, letterSpacing]);
}
