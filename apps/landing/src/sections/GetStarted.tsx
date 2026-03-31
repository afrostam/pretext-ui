import React from "react";

const QUICK_START = `import { VirtualList, ChatBubbles, StreamingText } from "@pretext-ui/react";

// That's it. Pass your font string and line height.
// pretext handles the rest — no DOM measurement needed.

<VirtualList
  items={messages}
  font="16px Inter, sans-serif"
  lineHeight={24}
  renderRow={(row) => <Message {...row} />}
  style={{ height: "100vh" }}
/>`;

export function GetStarted() {
  return (
    <section className="py-24 border-t border-gray-800/50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-4">
          Get started in 30 seconds.
        </h2>
        <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
          Install, import, pass your font. That's the entire API contract.
        </p>

        {/* Install */}
        <div className="inline-block mb-8">
          <div className="code-block rounded-lg px-8 py-4 font-mono text-base text-gray-300">
            <span className="text-gray-600">$</span>{" "}
            <span className="text-accent-light">pnpm add</span>{" "}
            @pretext-ui/react @chenglou/pretext
          </div>
        </div>

        {/* Code example */}
        <div className="code-block rounded-xl p-6 text-left max-w-2xl mx-auto mb-12 overflow-x-auto">
          <pre className="font-mono text-sm text-gray-300 leading-relaxed">
            <code>{QUICK_START}</code>
          </pre>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/afrostam/pretext-ui"
            className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-dim text-white font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://github.com/afrostam/pretext-ui#api-reference"
            className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Docs
          </a>
          <a
            href="https://github.com/chenglou/pretext"
            className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            @chenglou/pretext
          </a>
        </div>
      </div>
    </section>
  );
}
