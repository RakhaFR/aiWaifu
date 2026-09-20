"use client";

import { useSyncExternalStore } from "react";
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
    () => localStorage.getItem(key) ?? fallback,
    () => fallback
  );
  const setValue = (v: string) => {
    localStorage.setItem(key, v);
    window.dispatchEvent(new Event("storage"));
  };
  return [value, setValue] as const;
}

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorage("gemini_api_key", "");
  const [costume, setCostume] = useLocalStorage("costume", "default");
  const { messages, loading, currentEmotion, sendMessage, clearMessages } =
    useChat();

  const costumeTyped = (costume === "sportswear" ? "sportswear" : "default") as
    | "default"
    | "sportswear";

  const handleSend = (text: string) => {
    if (!apiKey) {
      alert("Set your Gemini API key in Settings first (hover left edge)");
      return;
    }
    sendMessage(text, apiKey);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a] overflow-hidden">
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        costume={costumeTyped}
        onCostumeChange={setCostume}
        onClearChat={clearMessages}
      />

      <SpriteDisplay emotion={currentEmotion} costume={costumeTyped} />

      <div className="flex flex-col max-h-[45vh] min-h-[200px] bg-gradient-to-t from-[#080c16] via-[#0a0e1a]/95 to-transparent">
        <ChatArea messages={messages} loading={loading} />
        <InputBar onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
