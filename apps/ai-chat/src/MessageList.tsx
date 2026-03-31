import React, { useEffect, useRef, useMemo } from "react";
import { VirtualList, type VirtualRow, type VirtualListItem, measureHeight } from "@pretext-ui/react";
import type { Message } from "./types.js";

const FONT = "15px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 22;

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert messages to VirtualListItems
  const items: VirtualListItem[] = useMemo(
    () => messages.map((m) => ({ key: m.id, text: m.text })),
    [messages]
  );

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    const el = containerRef.current?.querySelector("[data-virtual-scroll]");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const renderRow = React.useCallback(
    (row: VirtualRow) => {
      const msg = messages[row.index];
      if (!msg) return null;

      const isUser = msg.role === "user";

      return (
        <div className={`px-6 py-3 ${isUser ? "" : "bg-bg-surface/30"}`}>
          <div className="max-w-3xl mx-auto flex gap-4">
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 ${
                isUser
                  ? "bg-accent/20 text-accent-light"
                  : "bg-emerald-900/30 text-emerald-400"
              }`}
            >
              {isUser ? "S" : "AI"}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-600 mb-1">
                {isUser ? "You" : "Assistant"}
              </div>
              <div
                className="text-gray-200 whitespace-pre-wrap break-words"
                style={{ font: FONT, lineHeight: `${LINE_HEIGHT}px` }}
              >
                {msg.text}
                {msg.isStreaming && (
                  <span className="inline-block w-[2px] h-[1em] bg-accent-light ml-0.5 align-text-bottom cursor-blink" />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [messages]
  );

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div ref={containerRef} className="flex-1 min-h-0">
      <VirtualList
        items={items}
        font={FONT}
        lineHeight={LINE_HEIGHT}
        rowPadding={48}
        overscan={3}
        renderRow={renderRow}
        className="h-full"
        data-virtual-scroll=""
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-light">
            <path
              d="M12 3C7.03 3 3 6.58 3 11c0 2.44 1.24 4.63 3.2 6.13L5 21l4.34-1.86C10.2 19.38 11.08 19.5 12 19.5c4.97 0 9-3.58 9-8S16.97 3 12 3z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-200 mb-2">AI Chat Demo</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          This chat uses 4 pretext-ui components: VirtualList for the message history,
          ChatBubbles-style rendering, AutoResizeInput for the text box, and StreamingText
          for the responses. Zero DOM measurement anywhere.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["How does pretext work?", "Tell me about streaming", "Hi!"].map((q) => (
            <span
              key={q}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-800 text-gray-500"
            >
              Try: "{q}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
