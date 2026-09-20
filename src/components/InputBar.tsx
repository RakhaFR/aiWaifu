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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.06]"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-500/50 transition-colors"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-white/[0.06] disabled:text-white/20 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
      >
        Send
      </button>
    </form>
  );
}
