import React from "react";

const components = [
  {
    name: "VirtualList",
    description: "Infinite scroll with variable row heights. Binary search windowing. 50k rows in 30ms.",
    code: `<VirtualList
  items={messages}
  font="16px Inter, sans-serif"
  lineHeight={24}
  renderRow={(row) => (
    <div>{row.item.text}</div>
  )}
  style={{ height: 600 }}
/>`,
    color: "indigo",
  },
  {
    name: "ChatBubbles",
    description: "Each bubble shrink-wrapped to its widest line. No loose whitespace, no DOM reads.",
    code: `<ChatBubbles
  messages={conversation}
  font="14px Inter, sans-serif"
  lineHeight={20}
  maxBubbleWidth={320}
/>`,
    color: "emerald",
  },
  {
    name: "AutoResizeInput",
    description: "Textarea that grows as you type. No hidden mirror element. No scrollHeight hack.",
    code: `<AutoResizeInput
  font="16px Inter, sans-serif"
  lineHeight={24}
  minLines={1}
  maxLines={10}
  placeholder="Type..."
/>`,
    color: "amber",
  },
  {
    name: "MasonryGrid",
    description: "Pinterest-style layout. Cards placed into shortest column. All heights pre-computed.",
    code: `<MasonryGrid
  items={cards}
  font="14px Inter, sans-serif"
  lineHeight={20}
  columns={3}
  renderCard={(layout) => (
    <Card>{layout.item.text}</Card>
  )}
/>`,
    color: "rose",
  },
  {
    name: "StreamingText",
    description: "AI streaming without layout shift. Container pre-sized on every token. Content below never jumps.",
    code: `<StreamingText
  text={partialResponse}
  font="16px Inter, sans-serif"
  lineHeight={24}
  isStreaming={true}
/>`,
    color: "cyan",
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

        <div className="space-y-8">
          {components.map((comp) => {
            const c = colorMap[comp.color];
            return (
              <div
                key={comp.name}
                className={`rounded-xl border ${c.border} ${c.bg} p-8 grid grid-cols-1 lg:grid-cols-2 gap-8`}
              >
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <h3 className={`text-xl font-bold ${c.text}`}>{comp.name}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{comp.description}</p>
                </div>

                {/* Code */}
                <div className="code-block rounded-lg p-4 overflow-x-auto">
                  <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                    <code>{comp.code}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
