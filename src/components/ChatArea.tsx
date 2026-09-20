"use client";

import type { ChatMessage } from "@/lib/gemini";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
}

export default function ChatArea({ messages, loading }: Props) {
  const latestMessage = messages[messages.length - 1];
  const latestHoshinoMsg = [...messages].reverse().find((m) => m.role === "hoshino");
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none p-4 md:p-8">
      {/* Hoshino Comic Speech Bubble (Pointing towards character) */}
      <div className="w-full flex justify-center md:justify-end items-start pt-6 md:pr-16">
        {(latestHoshinoMsg || loading) && (
          <div className="relative max-w-lg md:max-w-xl animate-[fadeIn_0.25s_ease-out] pointer-events-auto">
            <div className="relative bg-white text-slate-800 shadow-2xl rounded-[2rem] px-6 py-4 md:px-8 md:py-5 border border-slate-200/90">
              {/* Tail pointing towards Hoshino */}
              <div
                className="absolute -left-3.5 top-6 w-0 h-0 
                border-t-[10px] border-t-transparent 
                border-r-[18px] border-r-white 
                border-b-[10px] border-b-transparent 
                drop-shadow-[-2px_2px_2px_rgba(0,0,0,0.06)]"
              />

              {loading && latestMessage?.role === "user" ? (
                <div className="flex items-center gap-1.5 py-1 text-slate-600 text-lg font-bold tracking-widest">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
              ) : (
                <p className="text-sm md:text-base leading-relaxed font-normal text-slate-900 break-words whitespace-pre-wrap">
                  {latestHoshinoMsg?.text || "Uhe~ Sensei... ada apa? Ngantuk banget nih..."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating User Message on lower right */}
      <div className="w-full flex justify-end pb-2 md:pr-16">
        {latestUserMsg && (
          <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-cyan-200 px-4 py-2 rounded-xl text-xs md:text-sm max-w-md shadow-xl flex items-center gap-2 pointer-events-auto">
            <span className="truncate">{latestUserMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
