import React, { useState, useCallback, useRef, useEffect } from "react";
import { StreamingText } from "@pretext-ui/react";

const FONT = "16px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 24;

const SAMPLE_RESPONSES = [
  `The key insight behind pretext is that text layout is fundamentally a mathematical problem. Given a font's metrics (advance widths per glyph, kerning pairs, line break opportunities), the number of lines text wraps to at a given width is fully deterministic.

Traditional approaches measure text by rendering it to the DOM and reading back dimensions — this triggers expensive browser reflow. pretext skips the DOM entirely: it segments the text using the Unicode Line Break Algorithm (UAX #14), measures glyph widths via a single canvas context, then computes line breaks with pure arithmetic.

The result? Layout that's 10-100x faster than DOM measurement, works identically on server and client, and produces pixel-perfect results across all scripts — Latin, CJK, Arabic, Hebrew, emoji, and more.`,

  `Here's how a virtual list typically works:

1. **Fixed heights** — every row is the same height. Simple but limiting.
2. **Estimated heights** — guess a height, render, measure, correct. This causes visible jumping.
3. **Pre-measurement** — render each row offscreen, measure with getBoundingClientRect(), cache the height. Accurate but expensive — O(n) DOM reflows.

pretext-ui takes a fourth approach: **arithmetic measurement**. For each row's text content, pretext computes the exact height it will occupy at the container's width. No rendering, no guessing, no reflow.

This means a VirtualList with 50,000 variable-height rows computes all heights in ~30ms. The same operation with DOM measurement would take several seconds.`,

  `React Server Components and pretext are a perfect match.

Since pretext is pure JavaScript with no DOM dependency (it only needs a canvas context for initial font measurement), it can run on the server to pre-compute layouts. This means:

- SSR produces HTML with correct dimensions from the first render
- No Cumulative Layout Shift (CLS) — the layout never adjusts after hydration
- Streaming SSR works naturally — each chunk arrives with its correct height

The implications for performance metrics are significant. Layout shift is one of the Core Web Vitals, and eliminating it entirely gives you a perfect CLS score of 0.`,
];

function useStreamSimulator() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [speed, setSpeed] = useState(20);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback((fullText: string) => {
    stop();
    setText("");
    indexRef.current = 0;
    setIsStreaming(true);

    const tick = () => {
      indexRef.current++;
      const nextChunk = fullText.slice(0, indexRef.current);
      setText(nextChunk);

      if (indexRef.current < fullText.length) {
        // Variable delay: faster for spaces/punctuation, slower for word starts
        const char = fullText[indexRef.current];
        const delay = char === " " || char === "\n"
          ? speed * 0.3
          : Math.random() * speed + speed * 0.5;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setIsStreaming(false);
      }
    };

    timerRef.current = setTimeout(tick, speed);
  }, [speed, stop]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { text, isStreaming, start, stop, speed, setSpeed };
}

export function StreamingTextDemo() {
  const stream = useStreamSimulator();
  const [height, setHeight] = useState(0);
  const [responseIndex, setResponseIndex] = useState(0);

  const handleStream = useCallback(() => {
    stream.start(SAMPLE_RESPONSES[responseIndex % SAMPLE_RESPONSES.length]);
    setResponseIndex((i) => i + 1);
  }, [stream, responseIndex]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleStream}
          disabled={stream.isStreaming}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {stream.isStreaming ? "Streaming…" : "Stream Response"}
        </button>
        {stream.isStreaming && (
          <button
            onClick={stream.stop}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
          >
            Stop
          </button>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">
            Speed:
            <span className="ml-1 font-mono text-indigo-400">{stream.speed}ms</span>
          </label>
          <input
            type="range"
            min={5}
            max={80}
            value={stream.speed}
            onChange={(e) => stream.setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      {/* The streaming text area */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-indigo-600/50 flex items-center justify-center text-[10px] font-bold text-indigo-300">
            AI
          </div>
          <span className="text-sm text-gray-400">Assistant</span>
          {stream.isStreaming && (
            <span className="text-xs text-indigo-400 animate-pulse">typing</span>
          )}
        </div>

        <StreamingText
          text={stream.text}
          font={FONT}
          lineHeight={LINE_HEIGHT}
          isStreaming={stream.isStreaming}
          textClassName="text-gray-200"
          onHeightChange={setHeight}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-xs text-gray-600">
        <span>
          Container height: <span className="text-gray-400 font-mono">{height}px</span>
        </span>
        <span>
          Characters: <span className="text-gray-400 font-mono">{stream.text.length}</span>
        </span>
        <span>
          Status: <span className={stream.isStreaming ? "text-indigo-400" : "text-gray-400"}>
            {stream.isStreaming ? "streaming" : "idle"}
          </span>
        </span>
      </div>

      {/* Layout shift demo */}
      <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">No layout shift demo</h4>
        <p className="text-xs text-gray-500 mb-3">
          This box sits directly below the streaming text. Watch — it never jumps, because pretext
          pre-computes the exact height on every token.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {["Content A", "Content B", "Content C"].map((label) => (
            <div
              key={label}
              className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-3 text-center text-xs text-gray-400"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
