import React, { useState, useMemo, useRef, useCallback } from "react";
import { VirtualList, type VirtualRow } from "@pretext-ui/react";
import { PerfCounter } from "./PerfCounter.js";
import { ChatBubblesDemo } from "./ChatBubblesDemo.js";
import { generateItems } from "./data.js";

const FONT = "16px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 24;

const ITEM_COUNTS = [1_000, 5_000, 10_000, 50_000];

type Tab = "virtual-list" | "chat-bubbles";

export function App() {
  const [tab, setTab] = useState<Tab>("virtual-list");
  const [itemCount, setItemCount] = useState(10_000);
  const items = useMemo(() => generateItems(itemCount), [itemCount]);

  const [listWidth, setListWidth] = useState(0);
  const widthObserverRef = useRef<ResizeObserver | null>(null);

  const listContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (widthObserverRef.current) {
      widthObserverRef.current.disconnect();
    }
    if (el) {
      setListWidth(el.clientWidth);
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setListWidth(entry.contentRect.width);
        }
      });
      ro.observe(el);
      widthObserverRef.current = ro;
    }
  }, []);

  const renderRow = useCallback((row: VirtualRow) => (
    <div className="flex gap-3 px-4 py-2 border-b border-gray-800/50">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-medium text-indigo-300 mt-0.5">
        {(row.index % 5) + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-500 mb-0.5">
          User {(row.index % 5) + 1}
          <span className="ml-2 text-gray-700">#{row.index}</span>
        </div>
        <div
          className="text-gray-200 whitespace-pre-wrap break-words"
          style={{ font: FONT, lineHeight: `${LINE_HEIGHT}px` }}
        >
          {row.item.text}
        </div>
      </div>
    </div>
  ), []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "virtual-list", label: "VirtualList" },
    { id: "chat-bubbles", label: "ChatBubbles" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-indigo-400">pretext-ui</span>
              <span className="text-gray-500 font-normal ml-2 text-sm">kitchen sink</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              React components powered by{" "}
              <code className="text-gray-400">@chenglou/pretext</code>
            </p>
          </div>
          <a
            href="https://github.com/afrostam/pretext-ui"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-gray-800 px-6">
        <div className="max-w-4xl mx-auto flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {tab === "virtual-list" && (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400">Items:</span>
              {ITEM_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setItemCount(count)}
                  className={`px-3 py-1 rounded-md text-sm font-mono transition-colors ${
                    count === itemCount
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {count.toLocaleString()}
                </button>
              ))}
            </div>

            <PerfCounter
              items={items}
              font={FONT}
              lineHeight={LINE_HEIGHT}
              containerWidth={listWidth}
            />

            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-lg font-semibold mb-3">
                VirtualList
                <span className="text-sm font-normal text-gray-500 ml-2">
                  {itemCount.toLocaleString()} items, variable heights, zero DOM measurement
                </span>
              </h2>

              <div ref={listContainerRef} className="flex-1 min-h-0 rounded-xl border border-gray-800 overflow-hidden">
                <VirtualList
                  items={items}
                  font={FONT}
                  lineHeight={LINE_HEIGHT}
                  rowPadding={16}
                  overscan={5}
                  renderRow={renderRow}
                  className="h-[600px]"
                  style={{ background: "rgb(3 7 18)" }}
                />
              </div>
            </div>
          </>
        )}

        {tab === "chat-bubbles" && (
          <div>
            <h2 className="text-lg font-semibold mb-3">
              ChatBubbles
              <span className="text-sm font-normal text-gray-500 ml-2">
                shrink-wrapped to widest line, zero DOM measurement
              </span>
            </h2>
            <ChatBubblesDemo />
          </div>
        )}
      </main>
    </div>
  );
}
