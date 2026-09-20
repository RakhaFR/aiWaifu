"use client";

import { useState } from "react";

interface Props {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  costume: "default" | "sportswear";
  onCostumeChange: (c: "default" | "sportswear") => void;
  onClearChat: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  bgTheme: string;
  onBgThemeChange: (bg: string) => void;
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
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l9.75 9.75" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
};

type Panel = "settings" | "costume" | "background" | "about" | null;

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
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);

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
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50 scale-105"
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
            title="Costumes"
          >
            {ICONS.costume}
          </button>

          <button
            onClick={() => togglePanel("background")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "background"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="Background Room"
          >
            {ICONS.palette}
          </button>

          <button
            onClick={() => togglePanel("settings")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "settings"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="API Settings"
          >
            {ICONS.settings}
          </button>

          <button
            onClick={() => togglePanel("about")}
            className={`p-2.5 rounded-xl transition-all ${
              panel === "about"
                ? "bg-white/20 text-cyan-300"
                : "text-white/70 hover:text-cyan-300 hover:bg-white/10"
            }`}
            title="About"
          >
            {ICONS.info}
          </button>

          <div className="flex-1" />

          <button
            onClick={onClearChat}
            className="p-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Chat History"
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
        <div className="fixed left-16 top-6 z-50 w-80 bg-[#0d1424]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-5 shadow-2xl shadow-black/80 text-white animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-semibold text-sm tracking-wide text-cyan-200">
              {panel === "settings" && "API Settings"}
              {panel === "costume" && "Hoshino Costumes"}
              {panel === "background" && "Room Background"}
              {panel === "about" && "About AI Waifu"}
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
            <div className="space-y-3">
              <div>
                <label className="text-white/70 text-xs block mb-1 font-medium">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white/[0.05] border border-cyan-500/30 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed">
                Dapatkan API Key gratis di{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  aistudio.google.com
                </a>
                . Menggunakan model Gemini Flash untuk respon cepat & kuota reset harian.
              </p>
            </div>
          )}

          {panel === "costume" && (
            <div className="space-y-2">
              {[
                { id: "default", name: "Uniform (Abydos High)", desc: "Seragam sekolah klasik dengan hoodie" },
                { id: "sportswear", name: "Sportswear (Gym PE)", desc: "Baju olahraga / jersey senam" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCostumeChange(c.id as "default" | "sportswear")}
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

          {panel === "background" && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "bedroom", label: "Anime Bedroom", color: "from-indigo-950 via-slate-900 to-sky-950" },
                { id: "starry", label: "Starry Night", color: "from-blue-950 via-gray-950 to-slate-950" },
                { id: "classroom", label: "Abydos Sunset", color: "from-amber-950 via-orange-950 to-slate-950" },
                { id: "minimal", label: "Deep Navy Blue", color: "from-[#080d1a] to-[#04060d]" },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onBgThemeChange(bg.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                    bgTheme === bg.id
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`h-12 w-full rounded-lg bg-gradient-to-br ${bg.color} shadow-inner`} />
                  <span className="text-xs font-medium text-white/90">{bg.label}</span>
                </button>
              ))}
            </div>
          )}

          {panel === "about" && (
            <div className="space-y-3 text-xs leading-relaxed text-white/60">
              <p>
                <strong className="text-cyan-300">Takanashi Hoshino (小鳥遊ホシノ)</strong> — Karakter dari Blue Archive. Siswa kelas 3 & mantan ketua dewan OSIS Abydos.
              </p>
              <p>
                Sistem dilengkapi 38 ekspresi sprite 2D yang reaktif mengikuti emosi percakapan secara real-time.
              </p>
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-200/80 text-[11px]">
                💡 Tip: Klik ikon panah di pojok kiri atas untuk drag dan zoom sprite sesuka kamu!
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
