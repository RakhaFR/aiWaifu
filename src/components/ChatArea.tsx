"use client";

import type { ChatMessage } from "@/lib/gemini";
import type { CharacterId } from "@/lib/emotionMap";
import { CHARACTERS } from "@/lib/emotionMap";

interface Props {
  character?: CharacterId;
  messages: ChatMessage[];
  loading: boolean;
  spriteTransform: { x: number; y: number; scale: number };
  isVoicePlaying: boolean;
  isVoiceFetching: boolean;
  onSkipAudio: () => void;
  theme?: "dark" | "light";
}

export default function ChatArea({
  character = "takanashi_hoshino",
  messages,
  loading,
  isVoicePlaying,
  isVoiceFetching,
  onSkipAudio,
  theme = "dark",
}: Props) {
  const latestMessage = messages[messages.length - 1];
  const latestCharMsg = [...messages].reverse().find((m) => m.role === "hoshino");
  const latestUserMsg = [...messages].reverse().find((m) => m.role === "user");

  const charMeta = CHARACTERS[character] || CHARACTERS.takanashi_hoshino;
  const isThinkingState = loading && latestMessage?.role === "user";
  const isDark = theme === "dark";

  const defaultGreetings: Record<CharacterId, string> = {
    takanashi_hoshino: "Uhe~ Sensei... ada apa? Hoshino lagi santai nih...",
    sorasaki_hina: "Sensei... akhirnya ada waktu berdua. Ada tugas yang perlu kubantu?",
    nakamasa_ichika: "Hehe~ Sensei, halo~ Ada perlu sesuatu denganku hari ini?",
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-end pointer-events-none px-4 md:px-8 pb-3">
      {/* Latest Sensei User Prompt */}
      {latestUserMsg && (
        <div className="w-full max-w-4xl mx-auto flex justify-end mb-3 pointer-events-auto">
          <div className="bg-[#182a3d]/90 backdrop-blur-md border border-cyan-400/40 text-cyan-100 px-4 py-2 rounded-xl text-xs md:text-sm shadow-xl flex items-center gap-2 max-w-lg animate-[fadeIn_0.2s_ease-out]">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Sensei:</span>
            <span className="truncate">{latestUserMsg.text}</span>
          </div>
        </div>
      )}

      {/* Blue Archive Official Visual Novel Dialogue Frame */}
      <div className="w-full flex justify-center pointer-events-auto">
        <div className={`dialogue-wrap dialogue-wrap--${theme}`}>
          {/* Speaker Badge */}
          <div className="speaker-tag flex items-center gap-2">
            <span>{charMeta.fullName}</span>
            <span className="text-[10px] opacity-75 font-medium">{charMeta.jpName}</span>
            {(isVoicePlaying || isVoiceFetching) && (
              <span className="flex items-center gap-[2.5px] ml-1">
                <span className={`w-[3px] h-3 ${isDark ? "bg-cyan-950" : "bg-cyan-700"} rounded-full animate-[voiceBar1_0.6s_ease-in-out_infinite]`} />
                <span className={`w-[3px] h-4 ${isDark ? "bg-cyan-900" : "bg-cyan-600"} rounded-full animate-[voiceBar2_0.6s_ease-in-out_infinite_0.15s]`} />
                <span className={`w-[3px] h-2.5 ${isDark ? "bg-cyan-950" : "bg-cyan-700"} rounded-full animate-[voiceBar3_0.6s_ease-in-out_infinite_0.3s]`} />
              </span>
            )}
          </div>

          {/* Frame Box */}
          <div
            className={`dialogue-frame ${
              isThinkingState && isVoiceFetching ? "cursor-pointer hover:brightness-105" : ""
            }`}
            onClick={isThinkingState && isVoiceFetching ? onSkipAudio : undefined}
          >
            {isThinkingState ? (
              <div className={`flex flex-col items-center justify-center py-2 ${isDark ? "text-cyan-200" : "text-slate-700"}`}>
                <div className="flex items-center gap-1.5 text-xl font-bold tracking-widest leading-none">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
                {isVoiceFetching && (
                  <span className={`text-xs font-semibold ${isDark ? "text-cyan-400/90" : "text-cyan-800/80"} mt-1`}>
                    Klik untuk lewati audio dan tampilkan teks langsung
                  </span>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">
                {latestCharMsg?.text || defaultGreetings[character] || "Uhe~ Sensei..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

