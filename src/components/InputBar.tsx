"use client";

import { useState, type FormEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  theme?: "dark" | "light";
}

export default function InputBar({ onSend, disabled, theme = "dark" }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const isDark = theme === "dark";

  return (
    <div className="w-full flex justify-center pb-5 pt-2 px-4 pointer-events-auto">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl relative flex items-center backdrop-blur-xl border shadow-2xl rounded-2xl p-1.5 transition-all focus-within:ring-2 ${
          isDark
            ? "bg-[#0f141d]/95 border-cyan-500/30 text-white focus-within:border-cyan-400 focus-within:ring-cyan-500/30"
            : "bg-white/95 border-slate-300 text-slate-800 focus-within:border-cyan-600 focus-within:ring-cyan-500/20"
        }`}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik pesan untuk Hoshino..."
          disabled={disabled}
          className={`flex-1 bg-transparent px-4 py-2 text-sm md:text-base outline-none ${
            isDark ? "text-white placeholder-slate-400/60" : "text-slate-900 placeholder-slate-400"
          }`}
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="h-10 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700/40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-1.5 font-bold text-xs tracking-wider transition-all shadow-md active:scale-95"
          title="Send"
        >
          <span>SEND</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            className="w-4 h-4 translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}


