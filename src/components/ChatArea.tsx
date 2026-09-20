"use client";

import { useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/gemini";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onOpenHistory?: () => void;
}

export default function ChatArea({ messages, loading }: Props) {
  const latestMessage = messages[messages.length - 1];
  const latestHoshinoMsg = [...messages].reverse().find((m) => m.role === "hoshino");
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none p-4 md:p-8">
      {/* Top / Mid Speech Bubble for Hoshino (pointing from character) */}
      <div className="w-full flex justify-center md:justify-end items-start pt-6 md:pr-12">
        {(latestHoshinoMsg || loading) && (
          <div className="relative max-w-lg md:max-w-xl animate-[fadeIn_0.3s_ease-out] pointer-events-auto">
            {/* Comic Speech Bubble */}
            <div className="relative bg-white text-slate-800 shadow-2xl rounded-[2.2rem] px-6 py-4 md:px-8 md:py-5 border-2 border-slate-100/80">
              {/* Bubble Tail pointing left towards Hoshino */}
              <div
                className="absolute -left-3 top-6 w-0 h-0 
                border-t-[10px] border-t-transparent 
                border-r-[18px] border-r-white 
                border-b-[10px] border-b-transparent 
                drop-shadow-[-2px_2px_2px_rgba(0,0,0,0.05)]"
              />

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-full">
                  Takanashi Hoshino
                </span>
                {latestHoshinoMsg?.emotion && (
                  <span className="text-[10px] font-medium text-slate-400 capitalize">
                    • {latestHoshinoMsg.emotion}
                  </span>
                )}
              </div>

              {loading && latestMessage?.role === "user" ? (
                <div className="flex items-center gap-1.5 py-1 text-slate-400 font-medium">
                  <span>Hoshino is thinking</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
              ) : (
                <p className="text-sm md:text-base leading-relaxed font-normal text-slate-800 break-words whitespace-pre-wrap">
                  {latestHoshinoMsg?.text || "Uhe~ Sensei... ada apa? Ngantuk banget nih..."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating User Message Preview on lower right (Visual Novel choice/input prompt style from image 1) */}
      <div className="w-full flex justify-end pb-2 md:pr-16">
        {latestUserMsg && (
          <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-200 px-4 py-2 rounded-xl text-xs md:text-sm max-w-md shadow-lg flex items-center gap-2 pointer-events-auto">
            <span className="text-cyan-400 font-semibold text-[11px] uppercase">Sensei:</span>
            <span className="truncate">{latestUserMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
