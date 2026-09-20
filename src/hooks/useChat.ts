"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/lib/gemini";
import type { Emotion } from "@/lib/emotionMap";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");

  const sendMessage = useCallback(
    async (text: string, apiKey: string) => {
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
          }),
        });

        const data = await res.json();

        if (data.error) {
          const errMsg: ChatMessage = {
            role: "hoshino",
            text: `Error: ${data.error}`,
            emotion: "confused",
          };
          setMessages((prev) => [...prev, errMsg]);
          setCurrentEmotion("confused");
        } else {
          const hoshinoMsg: ChatMessage = {
            role: "hoshino",
            text: data.message,
            emotion: data.emotion,
          };
          setMessages((prev) => [...prev, hoshinoMsg]);
          setCurrentEmotion(data.emotion);
        }
      } catch {
        const errMsg: ChatMessage = {
          role: "hoshino",
          text: "Zzz... koneksi terputus, Sensei...",
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

  return { messages, loading, currentEmotion, sendMessage, clearMessages };
}
