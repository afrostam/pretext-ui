import React, { useState, useCallback, useRef } from "react";
import { measureHeight } from "@pretext-ui/react";
import type { DemoItem } from "./data.js";

interface PerfCounterProps {
  items: DemoItem[];
  font: string;
  lineHeight: number;
  containerWidth: number;
}

interface PerfResult {
  pretextMs: number;
  reflowMs: number;
  itemCount: number;
}

/**
 * Side-by-side performance counter: DOM reflow vs pretext.
 * Runs both measurement approaches and displays timing.
 */
export function PerfCounter({ items, font, lineHeight, containerWidth }: PerfCounterProps) {
  const [result, setResult] = useState<PerfResult | null>(null);
  const [running, setRunning] = useState(false);
  const reflowContainerRef = useRef<HTMLDivElement>(null);

  const runBenchmark = useCallback(() => {
    setRunning(true);

    // Let the UI update, then run benchmark
    requestAnimationFrame(() => {
      const textWidth = Math.max(containerWidth - 32, 0);

      // --- Pretext measurement ---
      const pretextStart = performance.now();
      for (const item of items) {
        measureHeight(item.text, font, textWidth, lineHeight);
      }
      const pretextMs = performance.now() - pretextStart;

      // --- DOM reflow measurement ---
      const container = reflowContainerRef.current;
      if (!container) {
        setRunning(false);
        return;
      }

      // Create an offscreen element for DOM measurement
      const measurer = document.createElement("div");
      measurer.style.cssText = `
        position: absolute;
        visibility: hidden;
        width: ${textWidth}px;
        font: ${font};
        line-height: ${lineHeight}px;
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: 0;
        margin: 0;
        border: 0;
      `;
      container.appendChild(measurer);

      const reflowStart = performance.now();
      for (const item of items) {
        measurer.textContent = item.text;
        // Force reflow — this is what traditional virtual lists do
        measurer.getBoundingClientRect();
      }
      const reflowMs = performance.now() - reflowStart;

      container.removeChild(measurer);

      setResult({ pretextMs, reflowMs, itemCount: items.length });
      setRunning(false);
    });
  }, [items, font, lineHeight, containerWidth]);

  const speedup = result ? (result.reflowMs / result.pretextMs).toFixed(1) : null;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Performance Comparison</h3>
        <button
          onClick={runBenchmark}
          disabled={running || containerWidth <= 0}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          {running ? "Running…" : "Run Benchmark"}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-4">
          {/* Pretext result */}
          <div className="rounded-lg bg-emerald-950/50 border border-emerald-800/50 p-4">
            <div className="text-xs uppercase tracking-wider text-emerald-400 mb-1">
              pretext (arithmetic)
            </div>
            <div className="text-3xl font-mono font-bold text-emerald-300">
              {result.pretextMs.toFixed(2)}
              <span className="text-lg text-emerald-500 ml-1">ms</span>
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              {(result.pretextMs / result.itemCount * 1000).toFixed(1)} μs/item
            </div>
          </div>

          {/* DOM reflow result */}
          <div className="rounded-lg bg-red-950/50 border border-red-800/50 p-4">
            <div className="text-xs uppercase tracking-wider text-red-400 mb-1">
              DOM reflow (getBoundingClientRect)
            </div>
            <div className="text-3xl font-mono font-bold text-red-300">
              {result.reflowMs.toFixed(2)}
              <span className="text-lg text-red-500 ml-1">ms</span>
            </div>
            <div className="text-xs text-red-600 mt-1">
              {(result.reflowMs / result.itemCount * 1000).toFixed(1)} μs/item
            </div>
          </div>

          {/* Speedup banner */}
          <div className="col-span-2 text-center py-2 rounded-lg bg-gray-800/50">
            <span className="text-gray-400">pretext is </span>
            <span className="text-xl font-bold text-indigo-400">{speedup}x</span>
            <span className="text-gray-400"> faster</span>
            <span className="text-gray-600 text-sm ml-2">
              ({result.itemCount.toLocaleString()} items measured)
            </span>
          </div>
        </div>
      )}

      {!result && !running && (
        <p className="text-sm text-gray-500">
          Click "Run Benchmark" to measure {items.length.toLocaleString()} items with both approaches.
        </p>
      )}

      {/* Hidden container for DOM reflow measurement */}
      <div ref={reflowContainerRef} style={{ position: "absolute", left: -9999, top: -9999 }} />
    </div>
  );
}
