import React, { useState } from "react";
import { AutoResizeInput } from "@pretext-ui/react";

const FONT = "16px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 24;

export function AutoResizeInputDemo() {
  const [value, setValue] = useState("");
  const [height, setHeight] = useState(0);
  const [maxLines, setMaxLines] = useState(10);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">
          Max lines:
          <span className="ml-2 font-mono text-indigo-400">{maxLines}</span>
        </label>
        <input
          type="range"
          min={2}
          max={20}
          value={maxLines}
          onChange={(e) => setMaxLines(Number(e.target.value))}
          className="flex-1 max-w-xs"
        />
      </div>

      {/* Demo input */}
      <div className="max-w-lg">
        <AutoResizeInput
          font={FONT}
          lineHeight={LINE_HEIGHT}
          minLines={1}
          maxLines={maxLines}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onHeightChange={setHeight}
          placeholder="Start typing… the textarea grows as you type. No scrollHeight hacks, no hidden mirror elements — just pretext math."
          className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <div className="mt-2 flex gap-4 text-xs text-gray-600">
          <span>Height: <span className="text-gray-400 font-mono">{height}px</span></span>
          <span>Chars: <span className="text-gray-400 font-mono">{value.length}</span></span>
          <span>Lines: <span className="text-gray-400 font-mono">{value.split("\n").length}</span></span>
        </div>
      </div>

      {/* Side-by-side: controlled + uncontrolled */}
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div>
          <div className="text-xs text-gray-500 mb-2">Controlled (synced)</div>
          <AutoResizeInput
            font={FONT}
            lineHeight={LINE_HEIGHT}
            minLines={2}
            maxLines={6}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Uncontrolled (independent)</div>
          <AutoResizeInput
            font={FONT}
            lineHeight={LINE_HEIGHT}
            minLines={2}
            maxLines={6}
            defaultValue="Edit me independently!"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Height is computed by <code className="text-gray-400">pretext</code> on every keystroke.
        No hidden mirror element, no <code className="text-gray-400">scrollHeight</code> reads.
      </p>
    </div>
  );
}
