"use client";

import type { ChatMessage } from "@/lib/gemini";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  spriteTransform: { x: number; y: number; scale: number };
}

export default function ChatArea({ messages, loading, spriteTransform }: Props) {
  const latestMessage = messages[messages.length - 1];
  const latestHoshinoMsg = [...messages].reverse().find((m) => m.role === "hoshino");
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");

  // Calculate bubble position right next to Hoshino's face
  const spriteX = spriteTransform.x;
  const spriteY = spriteTransform.y;
  const spriteScale = spriteTransform.scale;

  const bubbleOffsetX = spriteX + 110 * spriteScale;
  const bubbleOffsetY = spriteY - 180 * spriteScale;

  const isThinkingState = loading && latestMessage?.role === "user";

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none p-4 md:p-6">
      {/* Hoshino Comic Speech Bubble (Positioned right beside Hoshino's face) */}
      <div
        style={{
          transform: `translate(${bubbleOffsetX}px, ${bubbleOffsetY}px)`,
        }}
        className="absolute left-1/2 top-1/2 z-20 transition-transform duration-75 pointer-events-auto"
      >
        {(latestHoshinoMsg || loading) && (
          <div className="relative animate-[fadeIn_0.15s_ease-out]">
            <div
              className={`relative bg-white text-slate-900 shadow-2xl border border-slate-200/90 transition-all ${
                isThinkingState
                  ? "rounded-full px-5 py-2.5 inline-flex items-center justify-center min-w-[68px]"
                  : "rounded-[1.75rem] px-5 py-3.5 md:px-6 md:py-4 max-w-xs sm:max-w-sm md:max-w-md"
              }`}
            >
              {/* Tail / Thought Dots */}
              {isThinkingState ? (
                <>
                  {/* Manga thought bubble dots */}
                  <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-slate-200 shadow-sm" />
                  <div className="absolute -left-5 top-[60%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white border border-slate-200 shadow-sm" />
                </>
              ) : (
                /* Seamless speech tail */
                <div
                  className="absolute -left-2.5 top-5 w-0 h-0 
                  border-t-[6px] border-t-transparent 
                  border-r-[12px] border-r-white 
                  border-b-[6px] border-b-transparent 
                  drop-shadow-[-1px_1px_1px_rgba(0,0,0,0.05)]"
                />
              )}

              {isThinkingState ? (
                <div className="flex items-center gap-1 text-slate-600 text-base font-bold tracking-widest leading-none px-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
              ) : (
                <div>
                  {/* Full Name Tag */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs font-bold text-cyan-600 tracking-wide">
                      Takanashi Hoshino
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      (小鳥遊ホシノ)
                    </span>
                  </div>

                  <p className="text-sm md:text-[15px] leading-relaxed font-normal text-slate-900 break-words whitespace-pre-wrap">
                    {latestHoshinoMsg?.text || "Uhe~ Sensei... ada apa? Ngantuk banget nih..."}
                  </p>
                </div>
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
