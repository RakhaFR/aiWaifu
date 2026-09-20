"use client";

import { useSyncExternalStore, useState } from "react";
import SpriteDisplay from "@/components/SpriteDisplay";
import ChatArea from "@/components/ChatArea";
import InputBar from "@/components/InputBar";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

function useLocalStorage(key: string, fallback: string) {
  const value = useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () => {
      if (typeof window === "undefined") return fallback;
      return localStorage.getItem(key) ?? fallback;
    },
    () => fallback
  );
  const setValue = (v: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, v);
      window.dispatchEvent(new Event("storage"));
    }
  };
  return [value, setValue] as const;
}

const BG_GRADIENTS: Record<string, string> = {
  bedroom: "bg-gradient-to-tr from-[#0a0f24] via-[#121936] to-[#1e1e40]",
  starry: "bg-gradient-to-b from-[#060814] via-[#0b1026] to-[#04060d]",
  classroom: "bg-gradient-to-tr from-[#2b1016] via-[#1f162b] to-[#0d1224]",
  minimal: "bg-[#0a0e1a]",
};

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorage("gemini_api_key", "");
  const [costume, setCostume] = useLocalStorage("costume", "default");
  const [bgTheme, setBgTheme] = useLocalStorage("bg_theme", "bedroom");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { messages, loading, currentEmotion, sendMessage, clearMessages } =
    useChat();

  const costumeTyped = (costume === "sportswear" ? "sportswear" : "default") as
    | "default"
    | "sportswear";

  const handleSend = (text: string) => {
    if (!apiKey) {
      alert("Masukkan Google Gemini API key kamu di menu Settings (hover sisi kiri layar) terlebih dahulu.");
      return;
    }
    sendMessage(text, apiKey);
  };

  const currentBgClass = BG_GRADIENTS[bgTheme] || BG_GRADIENTS.bedroom;

  return (
    <main className={`relative w-screen h-screen overflow-hidden ${currentBgClass} transition-colors duration-700 flex flex-col justify-between select-none`}>
      {/* Background Room Aesthetic Gradients & Details */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-black/30 pointer-events-none" />

      {/* Top Header Bar (Anime UI Style) */}
      <header className="relative z-30 w-full px-6 py-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-200/70">
            Abydos High • Forensic & Task Force
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {messages.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 transition-all"
            >
              Log ({messages.length})
            </button>
          )}
          <div className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
            Hoshino (호시노)
          </div>
        </div>
      </header>

      {/* Left Hover Reveal Sidebar */}
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        costume={costumeTyped}
        onCostumeChange={setCostume}
        onClearChat={clearMessages}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        bgTheme={bgTheme}
        onBgThemeChange={setBgTheme}
      />

      {/* Center 2D Sprite with Drag & Scale */}
      <SpriteDisplay
        emotion={currentEmotion}
        costume={costumeTyped}
        isEditMode={isEditMode}
      />

      {/* Dialogue Layer (Speech Bubble + Prompt) */}
      <div className="relative z-20 flex-1 flex flex-col justify-between">
        <ChatArea messages={messages} loading={loading} />
        <InputBar onSend={handleSend} disabled={loading} />
      </div>

      {/* Full Chat Log Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[80vh] bg-[#0c1322] border border-cyan-500/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-200 uppercase tracking-wider">
                Chat History Log
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-white/40 hover:text-white text-lg"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-cyan-600/20 border border-cyan-500/30 ml-8 text-cyan-100"
                      : "bg-white/[0.04] border border-white/5 mr-8 text-white/90"
                  }`}
                >
                  <div className="text-[11px] font-bold text-cyan-400 mb-1 capitalize">
                    {m.role === "user" ? "Sensei" : `Hoshino (${m.emotion || "talk"})`}
                  </div>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
