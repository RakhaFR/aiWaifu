"use client";

import type { ChatMessage } from "@/lib/gemini";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  spriteTransform?: { x: number; y: number; scale: number };
}

export default function ChatArea({ messages, loading, spriteTransform }: Props) {
  const latestMessage = messages[messages.length - 1];
  const latestHoshinoMsg = [...messages].reverse().find((m) => m.role === "hoshino");
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");

  // Calculate bubble position based on sprite position so it follows Hoshino naturally
  const spriteX = spriteTransform?.x ?? -180;
  const spriteY = spriteTransform?.y ?? 60;
  const spriteScale = spriteTransform?.scale ?? 1.35;

  // The head/mouth of Hoshino is roughly at center of sprite + vertical offset
  // Bubble should sit near the right side of her head
  const bubbleOffsetX = Math.max(10, Math.min(550, spriteX + 160 * spriteScale + 40));
  const bubbleOffsetY = Math.max(20, Math.min(300, spriteY - 140 * spriteScale + 120));

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none p-4 md:p-6">
      {/* Hoshino Comic Speech Bubble (Positioned beside Hoshino's head/mouth) */}
      <div
        style={{
          transform: `translate(${bubbleOffsetX}px, ${bubbleOffsetY}px)`,
        }}
        className="absolute left-1/2 top-16 md:top-20 z-20 transition-all duration-200 pointer-events-auto"
      >
        {(latestHoshinoMsg || loading) && (
          <div className="relative animate-[fadeIn_0.2s_ease-out]">
            <div
              className={`relative bg-white text-slate-900 shadow-2xl border-2 border-slate-100 transition-all ${
                loading && latestMessage?.role === "user"
                  ? "rounded-full px-6 py-3.5 w-auto inline-flex items-center justify-center min-w-[70px]"
                  : "rounded-[2rem] px-6 py-4 md:px-7 md:py-4.5 max-w-sm md:max-w-md lg:max-w-lg"
              }`}
            >
              {/* Tail pointing left towards Hoshino's mouth */}
              <div
                className="absolute -left-3 top-5 w-0 h-0 
                border-t-[8px] border-t-transparent 
                border-r-[15px] border-r-white 
                border-b-[8px] border-b-transparent 
                drop-shadow-[-2px_2px_1px_rgba(0,0,0,0.06)]"
              />

              {loading && latestMessage?.role === "user" ? (
                <div className="flex items-center gap-1.5 text-slate-700 text-base font-bold tracking-widest leading-none">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
              ) : (
                <p className="text-sm md:text-[15px] leading-relaxed font-normal text-slate-900 break-words whitespace-pre-wrap">
                  {latestHoshinoMsg?.text || "Uhe~ Sensei... ada apa? Ngantuk banget nih..."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating User Message on bottom right */}
      <div className="w-full flex justify-end pb-3 md:pr-12 mt-auto">
        {latestUserMsg && (
          <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-200 px-4 py-2 rounded-xl text-xs md:text-sm max-w-md shadow-2xl flex items-center gap-2 pointer-events-auto animate-[fadeIn_0.2s_ease-out]">
            <span className="truncate">{latestUserMsg.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
