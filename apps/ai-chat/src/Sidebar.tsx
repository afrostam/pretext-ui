import React from "react";
import type { Conversation } from "./types.js";

interface SidebarProps {
  conversations: Conversation[];
  activeConvId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function Sidebar({ conversations, activeConvId, onSelect, onNew }: SidebarProps) {
  return (
    <aside className="w-64 bg-bg-sidebar border-r border-gray-800/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-700/50 hover:border-gray-600 text-sm text-gray-300 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-500">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left px-4 py-2.5 text-sm truncate transition-colors ${
              conv.id === activeConvId
                ? "bg-bg-surface text-gray-200"
                : "text-gray-500 hover:text-gray-300 hover:bg-bg-surface/50"
            }`}
          >
            {conv.title}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="text-[10px] text-gray-700 leading-relaxed">
          Built with{" "}
          <a
            href="https://github.com/afrostam/pretext-ui"
            className="text-gray-600 hover:text-gray-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            pretext-ui
          </a>
        </div>
      </div>
    </aside>
  );
}
