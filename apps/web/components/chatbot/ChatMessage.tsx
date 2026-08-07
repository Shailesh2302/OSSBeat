"use client";

import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-foreground text-background"
            : "bg-muted text-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {sources && sources.length > 0 && (
          <details className="mt-2">
            <summary className="text-[0.5rem] uppercase tracking-widest cursor-pointer opacity-60">
              Sources ({sources.length})
            </summary>
            <ul className="mt-1 space-y-0.5">
              {sources.map((s, i) => (
                <li key={i} className="text-[0.5rem] opacity-50 font-mono truncate">
                  {s}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
