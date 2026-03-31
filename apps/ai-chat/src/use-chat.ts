import { useState, useCallback, useRef } from "react";
import type { Message, Conversation } from "./types.js";
import { getResponse } from "./ai-responses.js";

let msgId = 0;
function nextId() {
  return `msg-${++msgId}`;
}

let convId = 0;
function nextConvId() {
  return `conv-${++convId}`;
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    {
      id: nextConvId(),
      title: "New chat",
      messages: [],
      createdAt: Date.now(),
    },
  ]);
  const [activeConvId, setActiveConvId] = useState(conversations[0].id);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId)!;

  const updateConversation = useCallback(
    (convId: string, updater: (conv: Conversation) => Conversation) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? updater(c) : c))
      );
    },
    []
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = {
        id: nextId(),
        role: "user",
        text: text.trim(),
        timestamp: Date.now(),
      };

      const assistantMsgId = nextId();
      const fullResponse = getResponse(text);

      // Add user message + empty assistant message
      updateConversation(activeConvId, (conv) => ({
        ...conv,
        title: conv.messages.length === 0 ? text.trim().slice(0, 40) : conv.title,
        messages: [
          ...conv.messages,
          userMsg,
          {
            id: assistantMsgId,
            role: "assistant",
            text: "",
            timestamp: Date.now(),
            isStreaming: true,
          },
        ],
      }));

      // Stream tokens
      let charIndex = 0;
      const tick = () => {
        // Stream 1-3 characters at a time for natural feel
        const chunkSize = Math.random() < 0.3 ? 1 : Math.random() < 0.6 ? 2 : 3;
        charIndex = Math.min(charIndex + chunkSize, fullResponse.length);
        const partial = fullResponse.slice(0, charIndex);
        const done = charIndex >= fullResponse.length;

        updateConversation(activeConvId, (conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: partial, isStreaming: !done }
              : m
          ),
        }));

        if (!done) {
          const char = fullResponse[charIndex];
          const delay =
            char === "\n" ? 40 : char === " " ? 8 : Math.random() * 15 + 5;
          timerRef.current = setTimeout(tick, delay);
        }
      };

      timerRef.current = setTimeout(tick, 300);
    },
    [activeConvId, updateConversation]
  );

  const newConversation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const conv: Conversation = {
      id: nextConvId(),
      title: "New chat",
      messages: [],
      createdAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
  }, []);

  const isStreaming = activeConversation.messages.some((m) => m.isStreaming);

  return {
    conversations,
    activeConversation,
    activeConvId,
    setActiveConvId,
    sendMessage,
    newConversation,
    isStreaming,
  };
}
