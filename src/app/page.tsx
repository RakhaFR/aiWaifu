"use client";

import { useSyncExternalStore, useState, useEffect } from "react";
import SpriteDisplay, { DEFAULT_TRANSFORM, type SpriteTransform } from "@/components/SpriteDisplay";
import ChatArea from "@/components/ChatArea";
import InputBar from "@/components/InputBar";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { BACKGROUND_MAP, CHARACTERS } from "@/lib/emotionMap";

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
  const [selectedModel, setSelectedModel] = useLocalStorage("gemini_model", "gemini-3.6-flash");
  const [uiTheme, setUiTheme] = useLocalStorage("hoshino_ui_theme", "dark");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [spriteTransform, setSpriteTransform] = useState<SpriteTransform>(DEFAULT_TRANSFORM);

  const {
    characterId,
    setCharacterId,
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

  const voice = useVoice();
  const activeCharMeta = CHARACTERS[characterId] || CHARACTERS.takanashi_hoshino;

  // Persist sprite transform per character
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hoshino_sprite_transform_${characterId}`);
      if (saved) {
        setSpriteTransform(JSON.parse(saved));
      } else {
        setSpriteTransform(DEFAULT_TRANSFORM);
      }
    } catch {
      setSpriteTransform(DEFAULT_TRANSFORM);
    }
  }, [characterId]);

  const handleTransformChange = (t: SpriteTransform) => {
    setSpriteTransform(t);
    localStorage.setItem(`hoshino_sprite_transform_${characterId}`, JSON.stringify(t));
  };

  const handleSend = (text: string) => {
    if (!apiKey) {
      alert("Masukkan Google Gemini API key di menu Settings (hover sisi kiri layar).");
      return;
    }
    void sendMessage(text, apiKey, selectedModel, (message, showText) =>
      voice.speak(message.text, apiKey, showText, activeCharMeta.defaultVoiceId)
    );
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

      {/* Top Header Blue Archive Controls */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          {/* Active Unit Badge */}
          <div className="bg-[#0b1726]/85 backdrop-blur-md border border-cyan-500/30 px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold text-cyan-300 uppercase tracking-widest pointer-events-auto">
            {activeCharMeta.school} / {activeCharMeta.unit}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="slanted-button text-xs"
            >
              <span>Log ({messages.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => voice.setVoiceEnabled(!voice.voiceEnabled)}
            className={`slanted-button slanted-button--auto ${
              voice.voiceEnabled ? "slanted-button--active" : ""
            }`}
            title="Toggle Voice Autoplay"
          >
            <span>Auto</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`slanted-button slanted-button--menu ${
              isMenuOpen ? "slanted-button--active" : ""
            }`}
            title="Toggle Menu & Settings"
          >
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Left Hover Reveal Sidebar */}
      <Sidebar
        isOpen={isMenuOpen}
        onToggleOpen={() => setIsMenuOpen((prev) => !prev)}
        theme={uiTheme as "dark" | "light"}
        onThemeChange={setUiTheme}
        character={characterId}
        onCharacterChange={setCharacterId}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        costume={currentCostume}
        onCostumeChange={setCurrentCostume}
        onClearChat={clearMessages}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        bgTheme={currentBackground}
        onBgThemeChange={setCurrentBackground}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        voiceEnabled={voice.voiceEnabled}
        onVoiceEnabledChange={voice.setVoiceEnabled}
        fishAudioApiKey={voice.fishAudioApiKey}
        onFishAudioApiKeyChange={voice.setFishAudioApiKey}
        fishAudioReferenceId={voice.fishAudioReferenceId}
        onFishAudioReferenceIdChange={voice.setFishAudioReferenceId}
        voiceLanguage={voice.voiceLanguage}
        onVoiceLanguageChange={voice.setVoiceLanguage}
        presets={voice.presets}
        onAddPreset={voice.addPreset}
        onDeletePreset={voice.deletePreset}
        onSelectPreset={voice.selectPreset}
        isVoicePlaying={voice.isPlaying}
        isVoiceFetching={voice.isFetching}
      />

      {/* 2D Sprite Layer */}
      <SpriteDisplay
        character={characterId}
        emotion={currentEmotion}
        costume={currentCostume}
        isEditMode={isEditMode}
        isThinking={loading}
        transform={spriteTransform}
        onTransformChange={handleTransformChange}
      />

      {/* Dialogue Layer */}
      <div className="relative z-20 flex-1 flex flex-col justify-between">
        <ChatArea
          character={characterId}
          messages={messages}
          loading={loading}
          spriteTransform={spriteTransform}
          isVoicePlaying={voice.isPlaying}
          isVoiceFetching={voice.isFetching}
          onSkipAudio={voice.skipAudio}
          theme={uiTheme as "dark" | "light"}
        />
        <InputBar
          onSend={handleSend}
          disabled={loading}
          theme={uiTheme as "dark" | "light"}
        />
      </div>

      {/* Full Chat Log Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[80vh] ba-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden text-white">
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase">
                  RECORD / TRANSCRIPT
                </span>
                <h3 className="text-base font-extrabold text-cyan-100 tracking-wider">
                  Chat History Log
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-white/40 hover:text-white text-xl px-2"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const msgCharMeta = (m.characterId && CHARACTERS[m.characterId]) || activeCharMeta;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-sm ${
                      isUser
                        ? "bg-cyan-600/20 border border-cyan-500/30 ml-8 text-cyan-100"
                        : "bg-white/[0.04] border border-white/5 mr-8 text-white/90"
                    }`}
                  >
                    <div className="text-[11px] font-bold text-cyan-400 mb-1 capitalize">
                      {isUser ? "Sensei" : msgCharMeta.fullName}
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
