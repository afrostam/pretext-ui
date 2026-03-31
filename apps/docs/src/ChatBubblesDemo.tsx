import React, { useState, useMemo } from "react";
import { ChatBubbles, type ChatMessage } from "@pretext-ui/react";

const FONT = "14px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 20;

const CONVERSATION: ChatMessage[] = [
  { key: "1", sender: "other", text: "Hey! Have you seen the new pretext layout engine?", timestamp: "10:30" },
  { key: "2", sender: "self", text: "No, what is it?", timestamp: "10:31" },
  { key: "3", sender: "other", text: "It's a pure JavaScript library that measures multiline text height with arithmetic — no DOM reflow needed. The layout is deterministic.", timestamp: "10:31" },
  { key: "4", sender: "self", text: "Wait, so you can compute how tall text will be without rendering it? That sounds too good to be true.", timestamp: "10:32" },
  { key: "5", sender: "other", text: "Yep! Once you know the font metrics and break points, the line count is just math. It handles CJK, RTL, emoji, ligatures — everything.", timestamp: "10:32" },
  { key: "6", sender: "self", text: "😮", timestamp: "10:33" },
  { key: "7", sender: "other", text: "And look at these bubbles — they're shrink-wrapped to the widest line. All computed without touching the DOM.", timestamp: "10:33" },
  { key: "8", sender: "self", text: "That explains why they look so tight and clean. Most chat apps have weird extra whitespace on the right.", timestamp: "10:34" },
  { key: "9", sender: "other", text: "Exactly! Traditional approaches either:\n1. Use a fixed max-width (wasteful)\n2. Render hidden, measure, then show (slow flash)\n3. Just accept loose bubbles\n\nWith pretext we get pixel-perfect sizing instantly.", timestamp: "10:34" },
  { key: "10", sender: "self", text: "This is going to save so much time on our chat app. The getBoundingClientRect calls were killing our scroll performance.", timestamp: "10:35" },
  { key: "11", sender: "other", text: "🚀", timestamp: "10:35" },
  { key: "12", sender: "self", text: "K let me try it out", timestamp: "10:36" },
  { key: "13", sender: "other", text: "Here's the kicker — because it's pure math, it works identically on server and client. SSR with correct bubble sizes, no hydration mismatch, no layout shift.", timestamp: "10:36" },
  { key: "14", sender: "self", text: "Ok now you're just showing off 😄", timestamp: "10:37" },
];

export function ChatBubblesDemo() {
  const [maxWidth, setMaxWidth] = useState(320);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-gray-400">
          Max bubble width:
          <span className="ml-2 font-mono text-indigo-400">{maxWidth}px</span>
        </label>
        <input
          type="range"
          min={160}
          max={500}
          value={maxWidth}
          onChange={(e) => setMaxWidth(Number(e.target.value))}
          className="flex-1 max-w-xs"
        />
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 max-w-lg mx-auto overflow-y-auto max-h-[600px]">
        <ChatBubbles
          messages={CONVERSATION}
          font={FONT}
          lineHeight={LINE_HEIGHT}
          maxBubbleWidth={maxWidth}
          gap={6}
        />
      </div>

      <p className="text-xs text-gray-600 mt-3 text-center">
        Drag the slider — bubbles resize instantly via pure arithmetic. No DOM measurement.
      </p>
    </div>
  );
}
