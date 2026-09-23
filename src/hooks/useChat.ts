"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/lib/gemini";
import type { Emotion, CostumeType } from "@/lib/emotionMap";

const STORAGE_KEY_MESSAGES = "hoshino_chat_history";
const STORAGE_KEY_STATE = "hoshino_chat_state";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [currentCostume, setCurrentCostume] = useState<CostumeType>("default");
  const [currentBackground, setCurrentBackground] = useState<string>("committee_room");

  // Load history & state from localStorage on client mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }

      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.emotion) setCurrentEmotion(parsed.emotion);
        if (parsed.costume) setCurrentCostume(parsed.costume);
        if (parsed.background) setCurrentBackground(parsed.background);
      }
    } catch {
      // Ignore corrupted localStorage data
    }
  }, []);

  const saveToStorage = (
    newMessages: ChatMessage[],
    emotion: Emotion,
    costume: CostumeType,
    background: string
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(newMessages));
      localStorage.setItem(
        STORAGE_KEY_STATE,
        JSON.stringify({ emotion, costume, background })
      );
    } catch {
      // Storage quota exceeded or unavailable
    }
  };

  const sendMessage = useCallback(
    async (
      text: string,
      apiKey: string,
      model?: string,
      onHoshinoMessage?: (message: ChatMessage, showText: () => void) => Promise<void>
    ) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", text };
      const updatedMessagesWithUser = [...messages, userMsg];
      setMessages(updatedMessagesWithUser);
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
          const nextMessages = [...updatedMessagesWithUser, errMsg];
          setMessages(nextMessages);
          setCurrentEmotion("sleepy");
          saveToStorage(nextMessages, "sleepy", currentCostume, currentBackground);
        } else {
          const hoshinoMsg: ChatMessage = {
            role: "hoshino",
            text: data.message,
            emotion: data.emotion,
            costume: data.costume,
            background: data.background,
          };
          const nextEmotion = data.emotion || currentEmotion;
          const nextCostume = data.costume || currentCostume;
          const nextBackground = data.background || currentBackground;
          const showText = () => {
            const nextMessages = [...updatedMessagesWithUser, hoshinoMsg];
            setMessages(nextMessages);
            if (data.emotion) setCurrentEmotion(data.emotion);
            if (data.costume) setCurrentCostume(data.costume);
            if (data.background) setCurrentBackground(data.background);
            saveToStorage(nextMessages, nextEmotion, nextCostume, nextBackground);
          };

          if (onHoshinoMessage) await onHoshinoMessage(hoshinoMsg, showText);
          else showText();
        }
      } catch {
        const errMsg: ChatMessage = {
          role: "hoshino",
          text: "Uhe~ Sensei... sepertinya koneksi terputus sebentar...",
          emotion: "sleepy",
        };
        const nextMessages = [...updatedMessagesWithUser, errMsg];
        setMessages(nextMessages);
        setCurrentEmotion("sleepy");
        saveToStorage(nextMessages, "sleepy", currentCostume, currentBackground);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, currentEmotion, currentCostume, currentBackground]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentEmotion("neutral");
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
      localStorage.removeItem(STORAGE_KEY_STATE);
    } catch {
      // Ignore
    }
  }, []);

  const handleManualCostumeChange = (c: CostumeType) => {
    setCurrentCostume(c);
    saveToStorage(messages, currentEmotion, c, currentBackground);
  };

  const handleManualBackgroundChange = (bg: string) => {
    setCurrentBackground(bg);
    saveToStorage(messages, currentEmotion, currentCostume, bg);
  };

  return {
    messages,
    loading,
    currentEmotion,
    currentCostume,
    currentBackground,
    setCurrentCostume: handleManualCostumeChange,
    setCurrentBackground: handleManualBackgroundChange,
    sendMessage,
    clearMessages,
  };
}
