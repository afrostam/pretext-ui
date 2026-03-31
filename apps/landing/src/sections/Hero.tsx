import React, { useState, useEffect, useRef } from "react";

const TAGLINE = "Text layout without the DOM.";

function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export function Hero() {
  const { displayed, done } = useTypewriter(TAGLINE, 60);

  return (
    <section className="relative hero-glow">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-bg-surface text-xs text-gray-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Powered by @chenglou/pretext
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none mb-6">
          <span className="text-accent-light">pretext</span>
          <span className="text-gray-300">-ui</span>
        </h1>

        {/* Animated tagline */}
        <p className="text-2xl sm:text-3xl font-medium text-gray-400 mb-4 h-10">
          {displayed}
          {!done && (
            <span className="inline-block w-[3px] h-[1em] bg-accent-light ml-0.5 align-text-bottom cursor-blink" />
          )}
        </p>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
          React components that compute multiline text height with pure arithmetic.
          No DOM reflow. No guessing. No layout shift. Ever.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com/afrostam/pretext-ui"
            className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a
            href="#components"
            className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold transition-colors"
          >
            See Components
          </a>
        </div>

        {/* Install snippet */}
        <div className="mt-12 inline-block">
          <div className="code-block rounded-lg px-6 py-3 font-mono text-sm text-gray-300">
            <span className="text-gray-600">$</span>{" "}
            <span className="text-accent-light">pnpm add</span>{" "}
            @pretext-ui/react @chenglou/pretext
          </div>
        </div>
      </div>
    </section>
  );
}
