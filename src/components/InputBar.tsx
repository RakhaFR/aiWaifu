"use client";

import { useState, type FormEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="w-full flex justify-center pb-6 px-4 pointer-events-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative flex items-center bg-[#252b36]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-1.5 transition-all focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masukan teks......."
          disabled={disabled}
          className="flex-1 bg-transparent px-4 py-2.5 text-sm md:text-base text-white placeholder-slate-400/70 outline-none"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="h-10 w-10 md:h-11 md:w-11 rounded-xl bg-slate-700/80 hover:bg-cyan-600 disabled:bg-slate-800/40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          title="Send"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 md:w-5 md:h-5 text-white/90 translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
