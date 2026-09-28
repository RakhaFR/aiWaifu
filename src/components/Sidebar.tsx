"use client";

import { useState } from "react";
import type { CostumeType, CharacterId } from "@/lib/emotionMap";
import { BACKGROUND_MAP, CHARACTERS } from "@/lib/emotionMap";
import { AVAILABLE_MODELS } from "@/lib/gemini";
import type { VoicePreset } from "@/hooks/useVoice";

interface Props {
  isOpen?: boolean;
  onToggleOpen?: () => void;
  theme?: "dark" | "light";
  onThemeChange?: (theme: "dark" | "light") => void;
  character: CharacterId;
  onCharacterChange: (c: CharacterId) => void;
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
  presets: VoicePreset[];
  onAddPreset: (name: string, refId: string, charId?: CharacterId) => void;
  onDeletePreset: (id: string) => void;
  onSelectPreset: (refId: string) => void;
  isVoicePlaying: boolean;
  isVoiceFetching: boolean;
}

const ICONS = {
  character: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
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

type Panel = "character" | "costume" | "scenery" | "voice" | "settings" | null;

export default function Sidebar({
  isOpen = false,
  theme = "dark",
  onThemeChange,
  character,
  onCharacterChange,
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
  presets,
  onAddPreset,
  onDeletePreset,
  onSelectPreset,
  isVoicePlaying,
  isVoiceFetching,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showFishAudioApiKey, setShowFishAudioApiKey] = useState(false);

  // New voice preset form state
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetRefId, setNewPresetRefId] = useState("");

  const isVisible = isOpen || hovered || isEditMode || panel !== null;
  const isDark = theme === "dark";

  const togglePanel = (p: Panel) => {
    setIsAddingPreset(false);
    setPanel((prev) => (prev === p ? null : p));
  };

  const activeCharacterMeta = CHARACTERS[character] || CHARACTERS.takanashi_hoshino;

  const handleSaveNewPreset = () => {
    if (!newPresetName.trim() || !newPresetRefId.trim()) return;
    onAddPreset(newPresetName.trim(), newPresetRefId.trim(), character);
    setNewPresetName("");
    setNewPresetRefId("");
    setIsAddingPreset(false);
  };

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-14 z-50 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!panel && !isOpen) setHovered(false);
        }}
      >
        <div
          className={`h-full flex flex-col items-center py-6 gap-3 transition-all duration-300 ${
            isVisible
              ? "opacity-100 bg-[#070e1a]/85 backdrop-blur-md border-r border-cyan-500/20"
              : "opacity-0"
          }`}
        >
          {/* 00 / Character Select */}
          <button
            onClick={() => togglePanel("character")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "character"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Select Student Character"
          >
            {ICONS.character}
          </button>

          {/* Edit Mode */}
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

          {/* Costume */}
          <button
            onClick={() => togglePanel("costume")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "costume"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Costume (Interactive auto / Manual)"
          >
            {ICONS.costume}
          </button>

          {/* Scenery */}
          <button
            onClick={() => togglePanel("scenery")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "scenery"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Scenery (Interactive auto / Manual)"
          >
            {ICONS.scenery}
          </button>

          {/* Voice */}
          <button
            onClick={() => togglePanel("voice")}
            className={`p-2.5 rounded-xl transition-all relative ${
              panel === "voice"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : voiceEnabled
                  ? "text-cyan-400 hover:text-cyan-300 hover:bg-white/10"
                  : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Voice Synthesizer (Fish Audio Presets)"
          >
            {ICONS.voice}
            {(isVoicePlaying || isVoiceFetching) && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => togglePanel("settings")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "settings"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="API Key & Model Settings"
          >
            {ICONS.settings}
          </button>

          <div className="flex-1" />

          {/* Clear Chat */}
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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onClick={() => {
            setPanel(null);
            setHovered(false);
            setIsAddingPreset(false);
          }}
        />
      )}

      {panel && (
        <div
          className={`fixed left-16 top-4 bottom-4 z-50 w-[420px] sm:w-[460px] rounded-2xl p-6 animate-[fadeIn_0.2s_ease-out] flex flex-col h-[calc(100vh-2rem)] ${
            isDark ? "ba-panel text-white" : "ba-panel ba-panel--light text-[#153450]"
          }`}
        >
          {/* Blue Archive Panel Header */}
          <div className={`flex items-start justify-between pb-3 border-b mb-4 flex-shrink-0 ${
            isDark ? "border-cyan-500/20" : "border-[#38bdf8]/30"
          }`}>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                isDark ? "text-cyan-400" : "text-[#0284c7]"
              }`}>
                {panel === "character" && "00 / Student Roster"}
                {panel === "settings" && "01 / Config & System"}
                {panel === "costume" && `02 / ${activeCharacterMeta.name} Wardrobe`}
                {panel === "scenery" && "03 / Mission Scenery"}
                {panel === "voice" && "04 / Voice Synthesizer"}
              </span>
              <h3 className={`font-extrabold text-lg tracking-tight flex items-center gap-2 mt-0.5 ${
                isDark ? "text-cyan-100" : "text-[#102a3e]"
              }`}>
                {panel === "character" && "Select Student"}
                {panel === "settings" && "System Settings"}
                {panel === "costume" && "Costume Selection"}
                {panel === "scenery" && "Background Stage"}
                {panel === "voice" && "Fish Audio Presets"}
              </h3>
            </div>
            <button
              onClick={() => {
                setPanel(null);
                setHovered(false);
                setIsAddingPreset(false);
              }}
              className={`text-xl px-2 py-0.5 transition-colors ${
                isDark ? "text-cyan-300/60 hover:text-cyan-200" : "text-[#477394] hover:text-[#102a3e]"
              }`}
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 space-y-4">

          {/* 00 / CHARACTER SELECT PANEL */}
          {panel === "character" && (
            <div className="space-y-3">
              <div className="ba-badge mb-2">ACTIVE STUDENT</div>
              <p className={`text-[11px] mb-3 ${isDark ? "text-cyan-200/80" : "text-[#3b678a]"}`}>
                Pilih murid yang ingin kamu ajak berinteraksi:
              </p>
              {(Object.keys(CHARACTERS) as CharacterId[]).map((cId) => {
                const char = CHARACTERS[cId];
                const isActive = character === cId;
                return (
                  <div
                    key={cId}
                    onClick={() => {
                      onCharacterChange(cId);
                      onSelectPreset(char.defaultVoiceId);
                    }}
                    className={`p-3.5 rounded-xl flex items-center justify-between transition-all ${
                      isDark
                        ? `ba-tile ${isActive ? "ba-tile--active" : ""}`
                        : `ba-tile ba-tile--light ${isActive ? "ba-tile--active" : ""}`
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isDark ? "text-cyan-100" : "text-[#102a3e]"}`}>
                          {char.fullName}
                        </span>
                        <span className={`text-xs ${isDark ? "text-cyan-400" : "text-[#0284c7]"}`}>
                          {char.jpName}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-[#557e9e]"}`}>
                        {char.school} • {char.unit}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-400 text-black">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 01 / SETTINGS PANEL */}
          {panel === "settings" && (
            <div className="space-y-4">
              {/* Global UI Theme Switcher */}
              <div>
                <label className={`text-xs block mb-1.5 font-bold uppercase tracking-wider ${
                  isDark ? "text-cyan-300/90" : "text-[#1a4464]"
                }`}>
                  UI Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onThemeChange?.("dark")}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                      isDark
                        ? "border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20"
                        : "border-slate-300 bg-white/70 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dark Obsidian
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange?.("light")}
                    className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                      !isDark
                        ? "border-[#0284c7] bg-[#e0f2fe] text-[#034169] shadow-md shadow-sky-500/20"
                        : "border-cyan-900/30 bg-black/20 text-white/60 hover:text-white"
                    }`}
                  >
                    Light Visual Novel
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="AIzaSy..."
                    className={`w-full rounded-xl px-3 py-2 pr-16 text-sm outline-none transition-all ${
                      isDark
                        ? "bg-white/[0.06] border border-cyan-500/30 text-white placeholder-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                        : "bg-white border border-[#38bdf8]/40 text-[#102a3e] placeholder-slate-400 focus:border-[#0284c7] focus:ring-1 focus:ring-sky-400/50 shadow-sm"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey((shown) => !shown)}
                    className={`absolute inset-y-0 right-0 px-3 text-[10px] font-bold ${
                      isDark ? "text-cyan-300 hover:text-cyan-100" : "text-[#0284c7] hover:text-[#0369a1]"
                    }`}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Fish Audio API Key
                </label>
                <div className="relative">
                  <input
                    type={showFishAudioApiKey ? "text" : "password"}
                    value={fishAudioApiKey}
                    onChange={(e) => onFishAudioApiKeyChange(e.target.value)}
                    placeholder="sk-fish-..."
                    className={`w-full rounded-xl px-3 py-2 pr-16 text-sm outline-none transition-all ${
                      isDark
                        ? "bg-white/[0.06] border border-cyan-500/30 text-white placeholder-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                        : "bg-white border border-[#38bdf8]/40 text-[#102a3e] placeholder-slate-400 focus:border-[#0284c7] focus:ring-1 focus:ring-sky-400/50 shadow-sm"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowFishAudioApiKey((shown) => !shown)}
                    className={`absolute inset-y-0 right-0 px-3 text-[10px] font-bold ${
                      isDark ? "text-cyan-300 hover:text-cyan-100" : "text-[#0284c7] hover:text-[#0369a1]"
                    }`}
                  >
                    {showFishAudioApiKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Bahasa Suara (TTS Language)
                </label>
                <select
                  value={voiceLanguage}
                  onChange={(e) => onVoiceLanguageChange(e.target.value as "ja" | "id" | "en")}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                    isDark
                      ? "bg-[#0d1624] border border-cyan-500/30 text-white focus:border-cyan-400"
                      : "bg-white border border-[#38bdf8]/40 text-[#102a3e] focus:border-[#0284c7] shadow-sm"
                  }`}
                >
                  <option value="ja">Japanese (Recommended Anime Voice)</option>
                  <option value="id">Indonesian</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Model AI (Dengan Auto-Fallback)
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none transition-all ${
                    isDark
                      ? "bg-[#0d1624] border border-cyan-500/30 text-white focus:border-cyan-400"
                      : "bg-white border border-[#38bdf8]/40 text-[#102a3e] focus:border-[#0284c7] shadow-sm"
                  }`}
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`pt-2 border-t text-[11px] leading-relaxed ${
                isDark ? "border-cyan-500/20 text-white/50" : "border-[#38bdf8]/30 text-[#477394]"
              }`}>
                <span>Dapatkan API Key: </span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-500 font-bold underline hover:text-cyan-400"
                >
                  Gemini
                </a>
                {" · "}
                <a
                  href="https://fish.audio/app/developers/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-500 font-bold underline hover:text-cyan-400"
                >
                  Fish Audio
                </a>
              </div>
            </div>
          )}

          {/* 02 / COSTUMES PANEL */}
          {panel === "costume" && (
            <div className="space-y-3">
              <div className="ba-badge mb-2">AUTO / MANUAL OVERRIDE</div>
              <p className={`text-[11px] mb-3 ${isDark ? "text-cyan-200/80" : "text-[#3b678a]"}`}>
                Kostum otomatis berganti dinamis sesuai dialog chat, atau pilih kostum spesifik di bawah:
              </p>
              {activeCharacterMeta.costumes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onCostumeChange(c.id as CostumeType)}
                  className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                    isDark
                      ? `ba-tile ${costume === c.id ? "ba-tile--active" : ""}`
                      : `ba-tile ba-tile--light ${costume === c.id ? "ba-tile--active" : ""}`
                  }`}
                >
                  <div>
                    <div className={`text-sm font-bold ${isDark ? "text-cyan-100" : "text-[#102a3e]"}`}>
                      {c.name}
                    </div>
                    <div className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-[#557e9e]"}`}>
                      {c.desc}
                    </div>
                  </div>
                  {costume === c.id && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-400 text-black">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 03 / SCENERY PANEL */}
          {panel === "scenery" && (
            <div className="space-y-3">
              <div className="ba-badge mb-2">SCENERY ADAPTIVE</div>
              <p className={`text-[11px] mb-3 ${isDark ? "text-cyan-200/80" : "text-[#3b678a]"}`}>
                Panggung latar otomatis berganti saat kamu mengajak murid ke lokasi baru via chat:
              </p>
              <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {Object.keys(BACKGROUND_MAP).map((bgKey) => (
                  <div
                    key={bgKey}
                    onClick={() => onBgThemeChange(bgKey)}
                    className={`p-2 rounded-xl flex flex-col gap-2 transition-all ${
                      isDark
                        ? `ba-tile ${bgTheme === bgKey ? "ba-tile--active" : ""}`
                        : `ba-tile ba-tile--light ${bgTheme === bgKey ? "ba-tile--active" : ""}`
                    }`}
                  >
                    <div
                      className="h-16 w-full rounded-lg bg-cover bg-center shadow-md border border-black/10"
                      style={{ backgroundImage: `url(${BACKGROUND_MAP[bgKey]})` }}
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold truncate capitalize ${
                        isDark ? "text-white/90" : "text-[#102a3e]"
                      }`}>
                        {bgKey.replace(/_/g, " ")}
                      </span>
                      {bgTheme === bgKey && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 04 / VOICE PANEL WITH QUICK PRESET MANAGER */}
          {panel === "voice" && (
            <div className="space-y-4">
              {/* Toggle Voice Audio */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                isDark ? "bg-cyan-500/10 border-cyan-400/20" : "bg-[#e0f2fe] border-[#38bdf8]/40"
              }`}>
                <div>
                  <div className={`text-sm font-bold ${isDark ? "text-cyan-100" : "text-[#102a3e]"}`}>
                    Voice Synthesizer
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? "text-cyan-300/70" : "text-[#356a91]"}`}>
                    Fish Audio Auto-Play
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onVoiceEnabledChange(!voiceEnabled)}
                  className={`slanted-button text-xs ${
                    voiceEnabled ? "slanted-button--active" : ""
                  }`}
                >
                  <span>{voiceEnabled ? "ENABLED" : "MUTED"}</span>
                </button>
              </div>

              {(isVoicePlaying || isVoiceFetching) && (
                <div className={`flex items-center gap-2 text-xs border rounded-xl px-3.5 py-2.5 ${
                  isDark
                    ? "text-cyan-200 bg-cyan-500/20 border-cyan-400/30"
                    : "text-[#034169] bg-[#bae6fd] border-[#38bdf8]/50"
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="font-semibold">
                    {isVoiceFetching ? "Generating voice..." : "Playing audio..."}
                  </span>
                </div>
              )}

              {/* Quick Voice Presets List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-cyan-300" : "text-[#1a4464]"
                  }`}>
                    Saved Voice Presets
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingPreset(true)}
                    className="text-xs font-bold text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                  >
                    + Add New Voice
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {presets.map((p) => {
                    const isSelected = fishAudioReferenceId === p.referenceId;
                    const isDefault = p.id.startsWith("preset_") && p.id.endsWith("_default");

                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? isDark
                              ? "border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/10"
                              : "border-[#0284c7] bg-[#e0f2fe] shadow-md shadow-sky-500/10"
                            : isDark
                              ? "border-white/10 bg-white/[0.03] hover:border-cyan-500/30"
                              : "border-slate-200 bg-white hover:border-[#38bdf8]/50"
                        }`}
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onSelectPreset(p.referenceId)}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${
                              isDark ? "text-cyan-100" : "text-[#102a3e]"
                            }`}>
                              {p.name}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-400 text-black">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] truncate block font-mono ${
                            isDark ? "text-white/40" : "text-slate-400"
                          }`}>
                            ID: {p.referenceId.slice(0, 16)}...
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!isSelected && (
                            <button
                              type="button"
                              onClick={() => onSelectPreset(p.referenceId)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                isDark
                                  ? "bg-white/10 text-cyan-300 hover:bg-cyan-500/30"
                                  : "bg-slate-100 text-[#0284c7] hover:bg-sky-100"
                              }`}
                            >
                              Use
                            </button>
                          )}
                          {!isDefault && (
                            <button
                              type="button"
                              onClick={() => onDeletePreset(p.id)}
                              className="p-1.5 rounded text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete preset"
                            >
                              {ICONS.trash}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Frame Baru: Modal Tambah Voice Preset */}
      {isAddingPreset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl animate-[fadeIn_0.15s_ease-out] ${
            isDark ? "ba-panel text-white" : "ba-panel ba-panel--light text-[#153450]"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div>
                <span className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase">
                  CUSTOM VOICE SYNTHESIZER
                </span>
                <h3 className={`text-base font-extrabold tracking-wider ${
                  isDark ? "text-cyan-100" : "text-[#102a3e]"
                }`}>
                  + Add New Voice Model
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingPreset(false)}
                className="text-white/40 hover:text-white text-xl px-2"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Nama Label Suara
                </label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Contoh: Hina Tsundere, Ichika Soft..."
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none ${
                    isDark
                      ? "bg-white/[0.06] border border-cyan-500/30 text-white placeholder-white/20 focus:border-cyan-400"
                      : "bg-white border border-[#38bdf8]/40 text-[#102a3e] placeholder-slate-400 focus:border-[#0284c7]"
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs block mb-1 font-semibold ${
                  isDark ? "text-white/80" : "text-[#1a4464]"
                }`}>
                  Fish Audio Reference ID
                </label>
                <input
                  type="text"
                  value={newPresetRefId}
                  onChange={(e) => setNewPresetRefId(e.target.value)}
                  placeholder="ffa3fa64f7604f35a102444c10e1ace3..."
                  className={`w-full rounded-xl px-3 py-2 text-sm outline-none font-mono ${
                    isDark
                      ? "bg-white/[0.06] border border-cyan-500/30 text-white placeholder-white/20 focus:border-cyan-400"
                      : "bg-white border border-[#38bdf8]/40 text-[#102a3e] placeholder-slate-400 focus:border-[#0284c7]"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddingPreset(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isDark ? "bg-white/10 text-white/70 hover:bg-white/20" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewPreset}
                  disabled={!newPresetName.trim() || !newPresetRefId.trim()}
                  className="slanted-button slanted-button--active text-xs disabled:opacity-50"
                >
                  <span>Simpan Voice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
