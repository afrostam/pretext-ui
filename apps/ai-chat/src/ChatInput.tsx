import React, { useState, useCallback, useRef } from "react";
import { AutoResizeInput } from "@pretext-ui/react";

const FONT = "15px Inter, system-ui, -apple-system, sans-serif";
const LINE_HEIGHT = 22;

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="border-t border-gray-800/50 bg-bg p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 rounded-xl border border-gray-800 bg-bg-input px-4 py-2 focus-within:border-gray-600 transition-colors">
          <AutoResizeInput
            font={FONT}
            lineHeight={LINE_HEIGHT}
            minLines={1}
            maxLines={8}
            verticalPadding={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Waiting for response..." : "Send a message... (Shift+Enter for new line)"}
            disabled={disabled}
            className="flex-1 bg-transparent text-gray-200 placeholder:text-gray-600 focus:outline-none disabled:opacity-50 resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent hover:bg-accent/80 disabled:opacity-30 disabled:hover:bg-accent flex items-center justify-center transition-colors mb-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13V8.5L1 7l13-4-4 13-3.5-6.5L3 8.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[10px] text-gray-700">
            Simulated responses — wire to a real API for production use
          </span>
          <span className="text-[10px] text-gray-700">
            pretext-ui
          </span>
        </div>
      </div>
    </div>
  );
}
