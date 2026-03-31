import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  VirtualList,
  ChatBubbles,
  AutoResizeInput,
  MasonryGrid,
  StreamingText,
  type VirtualRow,
  type VirtualListItem,
  type ChatMessage,
  type MasonryItem,
  type MasonryCardLayout,
  measureHeight,
} from "@pretext-ui/react";

const FONT = "14px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 20;

// --- VirtualList demo data ---
const SAMPLE_TEXTS = [
  "Hey, what's up?",
  "Not much, just working on this new text layout engine. It uses pure arithmetic to compute multiline text height — no DOM reflow needed!",
  "Wait, really? How does that even work?",
  "The key insight is that once you know the font metrics, you can compute exactly how many lines text will wrap to at a given width. It's deterministic math.",
  "That's wild. So you can lay out an entire virtual list without mounting a single row to the DOM first?",
  "Exactly! Traditional virtual lists either guess row heights, render offscreen to measure, or use fixed heights. With pretext, you get pixel-perfect variable heights at near-zero cost.",
  "🚀 Ship it!",
  "One more thing — because the layout is pure math, it works identically on server and client. SSR with correct heights, no hydration mismatch.",
];

function generateListItems(count: number): VirtualListItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `item-${i}`,
    text: SAMPLE_TEXTS[i % SAMPLE_TEXTS.length],
  }));
}

// --- ChatBubbles demo data ---
const CHAT_MESSAGES: ChatMessage[] = [
  { key: "1", sender: "other", text: "Have you tried pretext-ui?" },
  { key: "2", sender: "self", text: "No, what is it?" },
  { key: "3", sender: "other", text: "React components that compute text height with pure arithmetic. No DOM reflow anywhere." },
  { key: "4", sender: "self", text: "😮" },
  { key: "5", sender: "other", text: "Each bubble is shrink-wrapped to its widest line. Try dragging the slider!" },
  { key: "6", sender: "self", text: "Ok now I need this for my chat app. The getBoundingClientRect calls were killing scroll performance." },
  { key: "7", sender: "other", text: "🚀" },
];

// --- MasonryGrid demo data ---
const CARD_TEXTS = [
  "Pure arithmetic text layout.",
  "The key insight is that once you have font metrics, line breaking is deterministic.",
  "Just shipped a feature using pretext-ui. 500 cards laid out in 3ms.",
  "CJK, RTL, emoji — it handles everything.",
  "🚀",
  "Performance tip: prepare() is cached per text+font pair, so layout() is essentially free.",
  "Short card.",
  "Server-side rendering with correct heights? Yes. Same code on Node and the browser.",
  "The masonry algorithm: measure height, place in shortest column. O(n), no DOM.",
];

// --- StreamingText demo ---
const STREAM_TEXT = `pretext is a pure JavaScript text layout engine. Given a font's metrics and a container width, it computes the exact pixel height of any text — instantly, with pure arithmetic.

This means no DOM reflow, no hidden measurement elements, no layout shift. The container you're reading right now was pre-sized before each token appeared. Content below never jumps.

10-100x faster than getBoundingClientRect(). Works on server and client. Handles every script — Latin, CJK, Arabic, Hebrew, emoji.`;

function useStreamSimulator() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  const start = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setText("");
    indexRef.current = 0;
    setIsStreaming(true);

    const tick = () => {
      const chunkSize = Math.random() < 0.3 ? 1 : 2;
      indexRef.current = Math.min(indexRef.current + chunkSize, STREAM_TEXT.length);
      setText(STREAM_TEXT.slice(0, indexRef.current));

      if (indexRef.current < STREAM_TEXT.length) {
        const char = STREAM_TEXT[indexRef.current];
        const delay = char === " " || char === "\n" ? 6 : Math.random() * 12 + 5;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setIsStreaming(false);
      }
    };
    timerRef.current = setTimeout(tick, 200);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return { text, isStreaming, start };
}

// ============================================================
// Live demos
// ============================================================

function VirtualListDemo() {
  const items = useMemo(() => generateListItems(5000), []);

  const renderRow = useCallback((row: VirtualRow) => (
    <div className="flex gap-2 px-3 py-1.5 border-b border-white/5">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] text-accent-light mt-0.5">
        {(row.index % 4) + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-gray-600 mb-0.5">#{row.index}</div>
        <div className="text-gray-300 whitespace-pre-wrap break-words" style={{ font: FONT, lineHeight: `${LINE_HEIGHT}px` }}>
          {row.item.text}
        </div>
      </div>
    </div>
  ), []);

  return (
    <div>
      <div className="text-[10px] text-gray-600 mb-2">5,000 items — scroll freely, zero DOM measurement</div>
      <div className="rounded-lg border border-white/5 overflow-hidden">
        <VirtualList
          items={items}
          font={FONT}
          lineHeight={LINE_HEIGHT}
          rowPadding={20}
          overscan={3}
          renderRow={renderRow}
          className="h-[280px]"
          style={{ background: "#0a0a0e" }}
        />
      </div>
    </div>
  );
}

function ChatBubblesDemo() {
  const [maxWidth, setMaxWidth] = useState(280);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] text-gray-600">Max width:</span>
        <input type="range" min={140} max={380} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="flex-1 max-w-[180px]" />
        <span className="text-[10px] font-mono text-accent-light">{maxWidth}px</span>
      </div>
      <div className="rounded-lg border border-white/5 bg-[#0a0a0e] p-3 max-h-[280px] overflow-y-auto">
        <ChatBubbles messages={CHAT_MESSAGES} font={FONT} lineHeight={LINE_HEIGHT} maxBubbleWidth={maxWidth} gap={6} />
      </div>
    </div>
  );
}

function AutoResizeInputDemo() {
  return (
    <div>
      <div className="text-[10px] text-gray-600 mb-2">Type or paste text — grows instantly, no scrollHeight reads</div>
      <AutoResizeInput
        font={FONT}
        lineHeight={LINE_HEIGHT}
        minLines={2}
        maxLines={8}
        verticalPadding={16}
        placeholder="Start typing here... try pasting a paragraph. The textarea resizes instantly using pretext math — no hidden mirror element."
        className="w-full rounded-lg border border-white/10 bg-[#0a0a0e] px-3 py-2 text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-accent/40 transition-colors"
      />
    </div>
  );
}

function MasonryGridDemo() {
  const items: MasonryItem[] = useMemo(
    () => CARD_TEXTS.map((text, i) => ({ key: `card-${i}`, text })),
    []
  );

  const COLORS = ["border-indigo-800/30 bg-indigo-950/20", "border-emerald-800/30 bg-emerald-950/20", "border-amber-800/30 bg-amber-950/20"];

  const renderCard = useCallback((layout: MasonryCardLayout) => (
    <div className={`h-full rounded-md border p-2 overflow-hidden ${COLORS[layout.column % COLORS.length]}`}>
      <div className="text-gray-300 text-xs" style={{ font: FONT, lineHeight: `${LINE_HEIGHT}px`, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {layout.item.text}
      </div>
    </div>
  ), []);

  return (
    <div>
      <div className="text-[10px] text-gray-600 mb-2">9 cards, 3 columns — all heights pre-computed</div>
      <MasonryGrid items={items} font={FONT} lineHeight={LINE_HEIGHT} columns={3} gap={8} cardPadding={18} cardHorizontalPadding={18} renderCard={renderCard} />
    </div>
  );
}

function StreamingTextDemo() {
  const stream = useStreamSimulator();

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={stream.start}
          disabled={stream.isStreaming}
          className="px-3 py-1 rounded-md bg-accent/80 hover:bg-accent disabled:opacity-40 text-xs font-medium transition-colors"
        >
          {stream.isStreaming ? "Streaming…" : "Stream Response"}
        </button>
        {stream.isStreaming && <span className="text-[10px] text-accent-light animate-pulse">zero layout shift</span>}
      </div>
      <div className="rounded-lg border border-white/5 bg-[#0a0a0e] p-3">
        <StreamingText
          text={stream.text || "Click \"Stream Response\" to see text appear without layout shift."}
          font={FONT}
          lineHeight={LINE_HEIGHT}
          isStreaming={stream.isStreaming}
          textClassName="text-gray-300"
        />
      </div>
      <div className="mt-2 rounded-md bg-white/[0.02] border border-white/5 p-2 text-center text-[10px] text-gray-600">
        This box never moves. The container above is pre-sized on every token.
      </div>
    </div>
  );
}

// ============================================================
// Main section
// ============================================================

const demos: { name: string; description: string; color: string; code: string; Demo: React.FC }[] = [
  {
    name: "VirtualList",
    description: "Infinite scroll with variable row heights. Binary search windowing. 50k rows in 30ms.",
    color: "indigo",
    code: `<VirtualList
  items={messages}
  font="16px Inter"
  lineHeight={24}
  renderRow={(row) => <div>{row.item.text}</div>}
/>`,
    Demo: VirtualListDemo,
  },
  {
    name: "ChatBubbles",
    description: "Each bubble shrink-wrapped to its widest line. No loose whitespace, no DOM reads.",
    color: "emerald",
    code: `<ChatBubbles
  messages={conversation}
  font="14px Inter"
  lineHeight={20}
  maxBubbleWidth={320}
/>`,
    Demo: ChatBubblesDemo,
  },
  {
    name: "AutoResizeInput",
    description: "Textarea that grows as you type. No hidden mirror element. No scrollHeight hack.",
    color: "amber",
    code: `<AutoResizeInput
  font="16px Inter"
  lineHeight={24}
  minLines={1}
  maxLines={10}
/>`,
    Demo: AutoResizeInputDemo,
  },
  {
    name: "MasonryGrid",
    description: "Pinterest-style layout. Cards placed into shortest column. All heights pre-computed.",
    color: "rose",
    code: `<MasonryGrid
  items={cards}
  font="14px Inter"
  lineHeight={20}
  columns={3}
  renderCard={(l) => <Card>{l.item.text}</Card>}
/>`,
    Demo: MasonryGridDemo,
  },
  {
    name: "StreamingText",
    description: "AI streaming without layout shift. Container pre-sized on every token.",
    color: "cyan",
    code: `<StreamingText
  text={partialResponse}
  font="16px Inter"
  lineHeight={24}
  isStreaming={true}
/>`,
    Demo: StreamingTextDemo,
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  indigo: { border: "border-indigo-800/40", bg: "bg-indigo-950/20", text: "text-indigo-400", dot: "bg-indigo-500" },
  emerald: { border: "border-emerald-800/40", bg: "bg-emerald-950/20", text: "text-emerald-400", dot: "bg-emerald-500" },
  amber: { border: "border-amber-800/40", bg: "bg-amber-950/20", text: "text-amber-400", dot: "bg-amber-500" },
  rose: { border: "border-rose-800/40", bg: "bg-rose-950/20", text: "text-rose-400", dot: "bg-rose-500" },
  cyan: { border: "border-cyan-800/40", bg: "bg-cyan-950/20", text: "text-cyan-400", dot: "bg-cyan-500" },
};

export function Components() {
  return (
    <section id="components" className="py-24 border-t border-gray-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-3">Components</h2>
        <p className="text-3xl sm:text-4xl font-bold text-gray-200 mb-16">
          Five components. Zero DOM measurement.
        </p>

        <div className="space-y-10">
          {demos.map((comp) => {
            const c = colorMap[comp.color];
            return (
              <div key={comp.name} className={`rounded-xl border ${c.border} ${c.bg} p-6 lg:p-8`}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <h3 className={`text-xl font-bold ${c.text}`}>{comp.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">{comp.description}</p>

                {/* Live demo + code side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Live demo */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Live Demo</div>
                    <comp.Demo />
                  </div>

                  {/* Code */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Code</div>
                    <div className="code-block rounded-lg p-4 h-full overflow-x-auto">
                      <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                        <code>{comp.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
