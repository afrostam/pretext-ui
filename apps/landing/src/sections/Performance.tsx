import React from "react";

const benchmarks = [
  { label: "10,000 messages", pretext: "~8ms", dom: "~800ms", speedup: "100x" },
  { label: "50,000 rows", pretext: "~30ms", dom: "~4,000ms", speedup: "130x" },
  { label: "Resize event", pretext: "~3ms", dom: "~300ms", speedup: "100x" },
];

export function Performance() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-3">Performance</h2>
        <p className="text-3xl sm:text-4xl font-bold text-gray-200 mb-4">
          Not a little faster. Orders of magnitude faster.
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mb-16">
          pretext computes layout with pure arithmetic after an initial font measurement pass.
          No reflow, no serialized DOM reads, no main thread blocking.
        </p>

        {/* Benchmark table */}
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-bg-surface border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
            <div>Scenario</div>
            <div className="text-center">pretext</div>
            <div className="text-center">DOM reflow</div>
            <div className="text-right">Speedup</div>
          </div>

          {/* Rows */}
          {benchmarks.map((b) => (
            <div
              key={b.label}
              className="grid grid-cols-4 gap-4 px-6 py-5 border-b border-gray-800/50 last:border-0"
            >
              <div className="text-gray-300 font-medium">{b.label}</div>
              <div className="text-center font-mono text-emerald-400">{b.pretext}</div>
              <div className="text-center font-mono text-red-400">{b.dom}</div>
              <div className="text-right font-mono font-bold text-accent-light">{b.speedup}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-4">
          Benchmarks measured on M1 MacBook Pro, Chrome 120. Actual speedup varies by hardware and text complexity.
          Run the benchmark yourself in the{" "}
          <a href="https://github.com/afrostam/pretext-ui" className="text-gray-400 underline hover:text-gray-200" target="_blank" rel="noopener noreferrer">
            kitchen sink demo
          </a>.
        </p>
      </div>
    </section>
  );
}
