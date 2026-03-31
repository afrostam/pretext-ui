import React, { type CSSProperties } from "react";
import { useChatBubbles, type ChatMessage, type BubbleLayout } from "./use-chat-bubbles.js";

export interface ChatBubblesProps {
  messages: ChatMessage[];
  /** CSS font string matching the rendered text. */
  font: string;
  /** Line height in px. */
  lineHeight: number;
  /** Maximum bubble width in px. Default: 320. */
  maxBubbleWidth?: number;
  /** Minimum bubble width in px. Default: 48. */
  minBubbleWidth?: number;
  /** Horizontal padding inside bubbles (left + right). Default: 24. */
  horizontalPadding?: number;
  /** Vertical padding inside bubbles (top + bottom). Default: 16. */
  verticalPadding?: number;
  /** Gap between messages in px. Default: 4. */
  gap?: number;
  /** Custom render function. Falls back to default bubble rendering. */
  renderBubble?: (layout: BubbleLayout) => React.ReactNode;
  /** Optional className for the outer container. */
  className?: string;
  /** Optional style for the outer container. */
  style?: CSSProperties;
}

/**
 * ChatBubbles — tight multiline message bubbles powered by pretext.
 *
 * Each bubble is shrink-wrapped to its widest line, computed via pure arithmetic.
 * No DOM measurement, no layout shift.
 */
export function ChatBubbles({
  messages,
  font,
  lineHeight,
  maxBubbleWidth = 320,
  minBubbleWidth,
  horizontalPadding = 24,
  verticalPadding = 16,
  gap = 4,
  renderBubble,
  className,
  style,
}: ChatBubblesProps) {
  const bubbles = useChatBubbles({
    messages,
    font,
    lineHeight,
    maxBubbleWidth,
    minBubbleWidth,
    horizontalPadding,
  });

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        ...style,
      }}
    >
      {bubbles.map((bubble) => {
        if (renderBubble) return <React.Fragment key={bubble.message.key}>{renderBubble(bubble)}</React.Fragment>;

        const isSelf = bubble.message.sender === "self";

        return (
          <div
            key={bubble.message.key}
            style={{
              display: "flex",
              justifyContent: isSelf ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                width: bubble.bubbleWidth,
                minHeight: bubble.textHeight + verticalPadding,
                padding: `${verticalPadding / 2}px ${horizontalPadding / 2}px`,
                borderRadius: 16,
                borderBottomRightRadius: isSelf ? 4 : 16,
                borderBottomLeftRadius: isSelf ? 16 : 4,
                backgroundColor: isSelf ? "#4f46e5" : "#27272a",
                color: isSelf ? "#fff" : "#e4e4e7",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  font,
                  lineHeight: `${lineHeight}px`,
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {bubble.message.text}
              </div>
              {bubble.message.timestamp && (
                <div
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.5,
                    textAlign: "right",
                    marginTop: 2,
                  }}
                >
                  {bubble.message.timestamp}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
