"use client";

import { useState } from "react";
import type { CostumeType } from "@/lib/emotionMap";
import { BACKGROUND_MAP } from "@/lib/emotionMap";
import { AVAILABLE_MODELS } from "@/lib/gemini";

interface Props {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  costume: CostumeType;
  onCostumeChange: (c: CostumeType) => void;
  onClearChat: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  bgTheme: string;
  onBgThemeChange: (bg: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  voiceEnabled: boolean;
  onVoiceEnabledChange: (v: boolean) => void;
  fishAudioApiKey: string;
  onFishAudioApiKeyChange: (key: string) => void;
  fishAudioReferenceId: string;
  onFishAudioReferenceIdChange: (id: string) => void;
  voiceLanguage: "ja" | "id" | "en";
  onVoiceLanguageChange: (language: "ja" | "id" | "en") => void;
  isVoicePlaying: boolean;
  isVoiceFetching: boolean;
}

const ICONS = {
  move: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  costume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  scenery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  voice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
};

type Panel = "settings" | "costume" | "scenery" | "voice" | null;

export default function Sidebar({
  apiKey,
  onApiKeyChange,
  costume,
  onCostumeChange,
  onClearChat,
  isEditMode,
  onToggleEditMode,
  bgTheme,
  onBgThemeChange,
  selectedModel,
  onModelChange,
  voiceEnabled,
  onVoiceEnabledChange,
  fishAudioApiKey,
  onFishAudioApiKeyChange,
  fishAudioReferenceId,
  onFishAudioReferenceIdChange,
  voiceLanguage,
  onVoiceLanguageChange,
  isVoicePlaying,
  isVoiceFetching,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showFishAudioApiKey, setShowFishAudioApiKey] = useState(false);

  const togglePanel = (p: Panel) => setPanel((prev) => (prev === p ? null : p));

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-14 z-50 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!panel) setHovered(false);
        }}
      >
        <div
          className={`h-full flex flex-col items-center py-6 gap-3 transition-all duration-300 ${
            hovered || isEditMode
              ? "opacity-100 bg-black/40 backdrop-blur-md border-r border-white/10"
              : "opacity-0"
          }`}
        >
          <button
            onClick={onToggleEditMode}
            className={`p-2.5 rounded-xl transition-all ${
              isEditMode
                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500/50 scale-105"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title={isEditMode ? "Lock Sprite Position" : "Move & Scale Sprite"}
          >
            {ICONS.move}
          </button>

          <button
            onClick={() => togglePanel("costume")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "costume"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Costume (Interactive auto / Manual)"
          >
            {ICONS.costume}
          </button>

          <button
            onClick={() => togglePanel("scenery")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "scenery"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Scenery (Interactive auto / Manual)"
          >
            {ICONS.scenery}
          </button>

          <button
            onClick={() => togglePanel("voice")}
            className={`p-2.5 rounded-xl transition-all relative ${
              panel === "voice"
                ? "bg-white/20 text-cyan-300"
                : voiceEnabled
                  ? "text-emerald-400 hover:text-cyan-300 hover:bg-white/10"
                  : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Voice Settings (Fish Audio)"
          >
            {ICONS.voice}
            {(isVoicePlaying || isVoiceFetching) && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => togglePanel("settings")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "settings"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="API Key & Model Settings"
          >
            {ICONS.settings}
          </button>

          <div className="flex-1" />

          <button
            onClick={onClearChat}
            className="p-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Chat"
          >
            {ICONS.trash}
          </button>
        </div>
      </div>

      {panel && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onClick={() => {
            setPanel(null);
            setHovered(false);
          }}
        />
      )}

      {panel && (
        <div className="fixed left-16 top-6 z-50 w-84 bg-[#0d1424]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-5 shadow-2xl shadow-black/80 text-white animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-semibold text-sm tracking-wide text-cyan-200">
              {panel === "settings" && "API & Model Settings"}
              {panel === "costume" && "Hoshino Costumes"}
              {panel === "scenery" && "Scenery & Background"}
              {panel === "voice" && "Voice Settings"}
            </h3>
            <button
              onClick={() => {
                setPanel(null);
                setHovered(false);
              }}
              className="text-white/40 hover:text-white text-lg px-1.5 py-0.5"
            >
              &times;
            </button>
          </div>

          {panel === "settings" && (
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-white/[0.05] border border-cyan-500/30 rounded-xl px-3 py-2 pr-16 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((shown) => !shown)}
                    className="absolute inset-y-0 right-0 px-3 text-[10px] text-cyan-300 hover:text-cyan-100"
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Fish Audio API Key
                </label>
                <div className="relative">
                  <input
                    type={showFishAudioApiKey ? "text" : "password"}
                    value={fishAudioApiKey}
                    onChange={(e) => onFishAudioApiKeyChange(e.target.value)}
                    placeholder="sk-fish-..."
                    className="w-full bg-white/[0.05] border border-cyan-500/30 rounded-xl px-3 py-2 pr-16 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFishAudioApiKey((shown) => !shown)}
                    className="absolute inset-y-0 right-0 px-3 text-[10px] text-cyan-300 hover:text-cyan-100"
                  >
                    {showFishAudioApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Voice Model ID / Reference ID
                </label>
                <input
                  type="text"
                  value={fishAudioReferenceId}
                  onChange={(e) => onFishAudioReferenceIdChange(e.target.value)}
                  placeholder="b94e6f4628ae4ec898981cc171faf42d"
                  className="w-full bg-white/[0.05] border border-cyan-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Bahasa Suara (TTS Language)
                </label>
                <select
                  value={voiceLanguage}
                  onChange={(e) => onVoiceLanguageChange(e.target.value as "ja" | "id" | "en")}
                  className="w-full bg-[#121b2f] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="ja">Japanese (Recommended for Anime Voice)</option>
                  <option value="id">Indonesian</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Model AI (Dengan Auto-Fallback)
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  className="w-full bg-[#121b2f] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.desc}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-cyan-300/70 mt-1">
                  Jika model yang dipilih mengalami lonjakan trafik (503), sistem otomatis beralih ke model alternatif seketika.
                </p>
              </div>

              <p className="text-white/40 text-[11px] leading-relaxed pt-1 border-t border-white/10">
                Dapatkan Gemini API Key di{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  aistudio.google.com
                </a>
                {" · "}
                Fish Audio API Key di{" "}
                <a
                  href="https://fish.audio/app/developers/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  fish.audio
                </a>
              </p>
            </div>
          )}

          {panel === "costume" && (
            <div className="space-y-2">
              <p className="text-[11px] text-cyan-300/80 mb-2">
                Otomatis berganti sesuai alur obrolan (pantai, olahraga, sekolah), atau pilih manual di bawah:
              </p>
              {[
                { id: "default", name: "Uniform (Abydos High)", desc: "Seragam sekolah klasik" },
                { id: "sportswear", name: "Sportswear (PE Tracksuit)", desc: "Baju olahraga / senam" },
                { id: "swimsuit", name: "Swimsuit (Summer Diorama)", desc: "Baju renang + pelampung paus" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCostumeChange(c.id as CostumeType)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    costume === c.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                      : "bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          )}

          {panel === "scenery" && (
            <div className="space-y-3">
              <p className="text-[11px] text-cyan-300/80 mb-2">
                Scenery otomatis berganti saat kamu ajak Hoshino ke lokasi baru via chat!
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {Object.keys(BACKGROUND_MAP).map((bgKey) => (
                  <button
                    key={bgKey}
                    onClick={() => onBgThemeChange(bgKey)}
                    className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                      bgTheme === bgKey
                        ? "border-cyan-400 bg-cyan-500/15"
                        : "border-white/10 hover:border-white/30 bg-black/20"
                    }`}
                  >
                    <div
                      className="h-14 w-full rounded-lg bg-cover bg-center shadow-inner"
                      style={{ backgroundImage: `url(${BACKGROUND_MAP[bgKey]})` }}
                    />
                    <span className="text-[11px] font-medium text-white/90 truncate capitalize">
                      {bgKey.replace(/_/g, " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "voice" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-white/70 text-xs font-medium">
                  Voice TTS (Fish Audio)
                </label>
                <button
                  onClick={() => onVoiceEnabledChange(!voiceEnabled)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    voiceEnabled ? "bg-emerald-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                      voiceEnabled ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {(isVoicePlaying || isVoiceFetching) && (
                <div className="flex items-center gap-2 text-xs text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isVoiceFetching ? "Generating voice..." : "Playing..."}
                </div>
              )}

              <p className="text-white/40 text-[11px] leading-relaxed pt-1 border-t border-white/10">
                API key tersimpan di browser ini dan dikirim melalui server aplikasi untuk menghindari CORS.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
