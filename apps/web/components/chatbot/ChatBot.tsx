"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const CHATBOT_API = process.env.NEXT_PUBLIC_CHATBOT_URL || "http://localhost:8000";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to OSSBeat. I'm your platform assistant. Ask me about discovering repos, GSoC, Hacktoberfest, or navigating the site.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${CHATBOT_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setConversationId(data.conversation_id);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant. Make sure the chatbot service is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, conversationId]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center border border-border bg-card text-foreground shadow-lg hover:bg-muted transition-colors"
        aria-label="Toggle chatbot"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{ animation: "pageFadeIn 0.2s ease-out" }}
          className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 border border-border bg-card shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <span className="newspaper-headline text-sm">OSSBeat</span>
              <span className="ml-2 text-[0.5rem] uppercase tracking-widest text-muted-foreground">
                Assistant
              </span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[28rem] min-h-[16rem]">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} sources={msg.sources} />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-75">.</span>
                    <span className="animate-pulse delay-150">.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask something..."
                className="flex-1 h-9 px-3 border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="h-9 px-3 border border-border bg-foreground text-background text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
