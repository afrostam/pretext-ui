import { useMemo } from "react";
import { measureText, measureLines } from "./pretext-helpers.js";

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
}

/**
 * Compute tight-fit bubble layouts using pretext.
 *
 * For each message, lays out at maxWidth then finds the widest line
 * to shrink-wrap the bubble. All pure arithmetic — no DOM.
 */
export function useChatBubbles(options: UseChatBubblesOptions): BubbleLayout[] {
  const {
    messages,
    font,
    lineHeight,
    maxBubbleWidth,
    minBubbleWidth = 48,
    horizontalPadding = 24,
  } = options;

  return useMemo(() => {
    const maxTextWidth = Math.max(maxBubbleWidth - horizontalPadding, 0);

    return messages.map((message): BubbleLayout => {
      if (!message.text) {
        return { message, bubbleWidth: minBubbleWidth, textHeight: lineHeight, lineCount: 1 };
      }

      // Layout with per-line info so we can find the widest line
      const linesResult = measureLines(message.text, font, maxTextWidth, lineHeight);
      const widestLine = linesResult.lines.reduce((max, line) => Math.max(max, line.width), 0);

      // Shrink-wrap: bubble is only as wide as its widest line + padding
      const bubbleWidth = Math.max(
        minBubbleWidth,
        Math.min(Math.ceil(widestLine) + horizontalPadding, maxBubbleWidth)
      );

      return {
        message,
        bubbleWidth,
        textHeight: linesResult.height,
        lineCount: linesResult.lineCount,
      };
    });
  }, [messages, font, lineHeight, maxBubbleWidth, minBubbleWidth, horizontalPadding]);
}
