import React, { useState } from "react";
import { Sidebar } from "./Sidebar.js";
import { MessageList } from "./MessageList.js";
import { ChatInput } from "./ChatInput.js";
import { useChat } from "./use-chat.js";

export function App() {
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          conversations={chat.conversations}
          activeConvId={chat.activeConvId}
          onSelect={chat.setActiveConvId}
          onNew={chat.newConversation}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 h-12 border-b border-gray-800/50 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-bg-surface text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm text-gray-400 truncate">
            {chat.activeConversation.title}
          </span>
          {chat.isStreaming && (
            <span className="text-xs text-accent-light animate-pulse ml-auto">
              streaming
            </span>
          )}
        </header>

        {/* Messages */}
        <MessageList messages={chat.activeConversation.messages} />

        {/* Input */}
        <ChatInput onSend={chat.sendMessage} disabled={chat.isStreaming} />
      </div>
    </div>
  );
}
