"use client";

import { useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/gemini";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatArea({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
      {messages.length === 0 && (
        <p className="text-center text-white/30 text-sm mt-8">
          Mulai chat dengan Hoshino...
        </p>
      )}
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-cyan-600/80 text-white rounded-br-sm"
                : "bg-white/[0.07] text-white/90 rounded-bl-sm backdrop-blur-sm border border-white/[0.05]"
            }`}
          >
            {msg.role === "hoshino" && (
              <span className="text-cyan-400 text-xs font-medium block mb-1">
                Hoshino
              </span>
            )}
            {msg.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm border border-white/[0.05]">
            <span className="text-cyan-400 text-xs font-medium block mb-1">
              Hoshino
            </span>
            <span className="text-white/50 text-sm flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce [animation-delay:0.15s]">.</span>
              <span className="animate-bounce [animation-delay:0.3s]">.</span>
            </span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
