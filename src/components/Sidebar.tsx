"use client";

import { useState } from "react";

interface Props {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  costume: "default" | "sportswear";
  onCostumeChange: (c: "default" | "sportswear") => void;
  onClearChat: () => void;
}

const ICONS = {
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  costume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
};

type Panel = "settings" | "costume" | "about" | null;

export default function Sidebar({
  apiKey,
  onApiKeyChange,
  costume,
  onCostumeChange,
  onClearChat,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);

  const togglePanel = (p: Panel) => setPanel((prev) => (prev === p ? null : p));

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-12 z-50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!panel) setHovered(false);
        }}
      >
        <div
          className={`h-full flex flex-col items-center pt-6 gap-3 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => togglePanel("settings")}
            className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
            title="Settings"
          >
            {ICONS.settings}
          </button>
          <button
            onClick={() => togglePanel("costume")}
            className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
            title="Costume"
          >
            {ICONS.costume}
          </button>
          <button
            onClick={() => togglePanel("about")}
            className="p-2 rounded-lg text-white/60 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
            title="About"
          >
            {ICONS.info}
          </button>

          <div className="flex-1" />

          <button
            onClick={onClearChat}
            className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/[0.06] transition-colors mb-6"
            title="Clear Chat"
          >
            {ICONS.trash}
          </button>
        </div>
      </div>

      {panel && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setPanel(null);
            setHovered(false);
          }}
        />
      )}

      {panel && (
        <div className="fixed left-14 top-4 z-50 w-72 bg-[#0f1729]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl">
          <button
            onClick={() => {
              setPanel(null);
              setHovered(false);
            }}
            className="absolute top-3 right-3 text-white/40 hover:text-white text-lg"
          >
            &times;
          </button>

          {panel === "settings" && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Settings</h3>
              <label className="text-white/50 text-xs block mb-1.5">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-cyan-500/50"
              />
              <p className="text-white/30 text-xs mt-2">
                Get free key at ai.google.dev
              </p>
            </div>
          )}

          {panel === "costume" && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Costume</h3>
              <div className="space-y-2">
                {(["default", "sportswear"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => onCostumeChange(c)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      costume === c
                        ? "bg-cyan-600/30 text-cyan-400 border border-cyan-500/30"
                        : "text-white/60 hover:bg-white/[0.06] border border-transparent"
                    }`}
                  >
                    {c === "default" ? "Default (Uniform)" : "Sportswear"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "about" && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">About</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                AI Waifu — Takanashi Hoshino
              </p>
              <p className="text-white/30 text-xs mt-2 leading-relaxed">
                Character from Blue Archive. Powered by Gemini 2.0 Flash.
                2D sprites with emotion-based expressions.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
