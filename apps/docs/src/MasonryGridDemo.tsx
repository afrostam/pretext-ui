import React, { useState, useMemo, useCallback } from "react";
import { MasonryGrid, type MasonryCardLayout, type MasonryItem } from "@pretext-ui/react";

const FONT = "14px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 20;

const CARD_TEXTS = [
  "Quick thought: pure arithmetic text layout changes everything.",
  "The key insight is that once you have font metrics, line breaking is deterministic. No DOM needed.",
  "Just shipped a feature using pretext-ui. The MasonryGrid laid out 500 cards in 3ms. Previously it took 200ms with getBoundingClientRect.",
  "TIL: Unicode Line Break Algorithm (UAX #14) defines exactly where text can break. pretext implements this fully.",
  "Hot take: virtual lists that guess row heights are tech debt. With pretext you get exact heights for free.",
  "CJK text wrapping is notoriously tricky. Characters can break almost anywhere, but not after opening brackets or before closing ones. pretext handles all of this.",
  "🚀",
  "Performance tip: prepare() is the expensive call (font measurement). But it's cached per text+font pair, so layout() is essentially free after that.",
  "The difference between pretext and DOM measurement is most dramatic on mobile. No forced reflow means no jank during scroll.",
  "RTL text support is built in. Hebrew, Arabic — they just work. The bidi algorithm runs during prepare().",
  "Short card.",
  "Server-side rendering with correct heights? Yes. Because it's pure math, the same code runs on Node and the browser. No hydration mismatch.",
  "I've been using pretext-ui's ChatBubbles component. Each bubble is shrink-wrapped to its widest line — looks way better than fixed-width bubbles.",
  "Fun fact: emoji have variable widths depending on the font and whether they're combined with zero-width joiners. pretext measures them correctly.",
  "One line.",
  "The masonry layout algorithm is simple: for each card, measure its text height with pretext, then place it in the shortest column. Pure O(n) with no DOM reads.",
  "AutoResizeInput is my favorite component. The textarea just grows as you type. No hidden mirror element, no scrollHeight hack. Just math.",
  "Accessibility note: all pretext-ui components render semantic HTML. The layout math is invisible to the user — they just see fast, correct rendering.",
];

const COLORS = [
  "border-indigo-800/40 bg-indigo-950/30",
  "border-emerald-800/40 bg-emerald-950/30",
  "border-amber-800/40 bg-amber-950/30",
  "border-rose-800/40 bg-rose-950/30",
  "border-cyan-800/40 bg-cyan-950/30",
  "border-violet-800/40 bg-violet-950/30",
];

function generateCards(count: number): MasonryItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `card-${i}`,
    text: CARD_TEXTS[i % CARD_TEXTS.length],
  }));
}

export function MasonryGridDemo() {
  const [columns, setColumns] = useState(3);
  const [cardCount, setCardCount] = useState(30);
  const items = useMemo(() => generateCards(cardCount), [cardCount]);

  const renderCard = useCallback((layout: MasonryCardLayout) => {
    const colorClass = COLORS[layout.column % COLORS.length];
    return (
      <div
        className={`h-full rounded-lg border p-3 ${colorClass}`}
        style={{ boxSizing: "border-box" }}
      >
        <div
          className="text-gray-300"
          style={{
            font: FONT,
            lineHeight: `${LINE_HEIGHT}px`,
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {layout.item.text}
        </div>
        <div className="text-[10px] text-gray-600 mt-1">
          #{layout.item.key.split("-")[1]} · col {layout.column + 1} · {Math.round(layout.height)}px
        </div>
      </div>
    );
  }, []);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Columns:</span>
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setColumns(n)}
              className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
                n === columns
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Cards:</span>
          {[18, 30, 60, 120].map((n) => (
            <button
              key={n}
              onClick={() => setCardCount(n)}
              className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
                n === cardCount
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <MasonryGrid
        items={items}
        font={FONT}
        lineHeight={LINE_HEIGHT}
        columns={columns}
        gap={12}
        cardPadding={40}
        cardHorizontalPadding={26}
        renderCard={renderCard}
      />

      <p className="text-xs text-gray-600 text-center">
        All card heights computed by <code className="text-gray-400">pretext</code> — zero DOM measurement.
        Try changing columns to see instant re-layout.
      </p>
    </div>
  );
}
