"use client";

import { useSyncExternalStore, useState } from "react";
import SpriteDisplay from "@/components/SpriteDisplay";
import ChatArea from "@/components/ChatArea";
import InputBar from "@/components/InputBar";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";
import { BACKGROUND_MAP, type CostumeType } from "@/lib/emotionMap";

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

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorage("gemini_api_key", "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {
    messages,
    loading,
    currentEmotion,
    currentCostume,
    currentBackground,
    setCurrentCostume,
    setCurrentBackground,
    sendMessage,
    clearMessages,
  } = useChat();

  const handleSend = (text: string) => {
    if (!apiKey) {
      alert("Masukkan Google Gemini API key di menu Settings (hover sisi kiri layar).");
      return;
    }
    sendMessage(text, apiKey);
  };

  const bgImage = BACKGROUND_MAP[currentBackground] || BACKGROUND_MAP.committee_room;

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none bg-slate-950">
      {/* Dynamic Scenery Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-[0.78] contrast-[1.05]"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Subtle Vignette & Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

      {/* Top Header Log Button (Minimal) */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-end pointer-events-none">
        {messages.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="pointer-events-auto text-xs bg-slate-900/80 hover:bg-slate-800 text-white/90 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg transition-all"
          >
            Log ({messages.length})
          </button>
        )}
      </header>

      {/* Left Hover Reveal Sidebar */}
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        costume={currentCostume}
        onCostumeChange={setCurrentCostume}
        onClearChat={clearMessages}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        bgTheme={currentBackground}
        onBgThemeChange={setCurrentBackground}
      />

      {/* Center 2D Sprite with Drag, Scale & Closed-eye Thinking state */}
      <SpriteDisplay
        emotion={currentEmotion}
        costume={currentCostume}
        isEditMode={isEditMode}
        isThinking={loading}
      />

      {/* Dialogue Layer */}
      <div className="relative z-20 flex-1 flex flex-col justify-between">
        <ChatArea messages={messages} loading={loading} />
        <InputBar onSend={handleSend} disabled={loading} />
      </div>

      {/* Full Chat Log Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[80vh] bg-[#0c1322] border border-cyan-500/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-200 tracking-wider">
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
                    {m.role === "user" ? "Sensei" : "Hoshino"}
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
