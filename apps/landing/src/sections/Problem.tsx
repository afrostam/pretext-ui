import React from "react";

const problems = [
  {
    label: "DOM Reflow",
    description: "Traditional: render text offscreen, call getBoundingClientRect(), read the height. Triggers browser reflow. Blocks the main thread.",
    visual: "slow",
  },
  {
    label: "Guessing",
    description: "Estimate row heights based on character count. Gets it wrong for multi-line text, CJK, emoji. Content jumps when corrected.",
    visual: "wrong",
  },
  {
    label: "Fixed Heights",
    description: "Force every row to the same height. Wastes space on short messages. Clips long ones. Looks bad.",
    visual: "rigid",
  },
];

export function Problem() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-3">The Problem</h2>
        <p className="text-3xl sm:text-4xl font-bold text-gray-200 mb-4">
          Measuring text height shouldn't be this hard.
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mb-16">
          Every virtual list, chat app, and card layout faces the same question:
          how tall will this text be? The existing answers all suck.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {problems.map((p) => (
            <div key={p.label} className="rounded-xl border border-red-900/30 bg-red-950/10 p-6">
              <div className="text-sm font-semibold text-red-400 mb-2">{p.label}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* The solution */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-8 glow-border">
          <div className="text-sm font-semibold text-accent-light mb-2">The pretext approach</div>
          <p className="text-xl text-gray-200 font-medium mb-3">
            Pure arithmetic. Given font metrics and a width, compute the exact line count and height.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            pretext segments text using the Unicode Line Break Algorithm (UAX #14),
            measures glyph widths once via canvas, then computes layout with math alone.
            10-100x faster than DOM reflow. Works on server and client. Handles every script
            — Latin, CJK, Arabic, Hebrew, emoji, ligatures.
          </p>
        </div>
      </div>
    </section>
  );
}
