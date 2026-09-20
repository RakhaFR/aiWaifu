"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/lib/gemini";
import type { Emotion, CostumeType } from "@/lib/emotionMap";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [currentCostume, setCurrentCostume] = useState<CostumeType>("default");
  const [currentBackground, setCurrentBackground] = useState<string>("committee_room");

  const sendMessage = useCallback(
    async (text: string, apiKey: string, model?: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages,
            apiKey,
            model,
          }),
        });

        const data = await res.json();

        if (data.error) {
          const errMsg: ChatMessage = {
            role: "hoshino",
            text: "Uhe~ Server lagi sibuk nih Sensei... Coba panggil ojisan sekali lagi ya~",
            emotion: "sleepy",
          };
          setMessages((prev) => [...prev, errMsg]);
          setCurrentEmotion("sleepy");
        } else {
          const hoshinoMsg: ChatMessage = {
            role: "hoshino",
            text: data.message,
            emotion: data.emotion,
            costume: data.costume,
            background: data.background,
          };
          setMessages((prev) => [...prev, hoshinoMsg]);
          if (data.emotion) setCurrentEmotion(data.emotion);
          if (data.costume) setCurrentCostume(data.costume);
          if (data.background) setCurrentBackground(data.background);
        }
      } catch {
        const errMsg: ChatMessage = {
          role: "hoshino",
          text: "Uhe~ Sensei... sepertinya koneksi terputus sebentar...",
          emotion: "sleepy",
        };
        setMessages((prev) => [...prev, errMsg]);
        setCurrentEmotion("sleepy");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentEmotion("neutral");
  }, []);

  return {
    messages,
    loading,
    currentEmotion,
    currentCostume,
    currentBackground,
    setCurrentCostume,
    setCurrentBackground,
    sendMessage,
    clearMessages,
  };
}
