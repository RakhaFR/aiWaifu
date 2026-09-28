"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/lib/gemini";
import type { Emotion, CostumeType, CharacterId } from "@/lib/emotionMap";
import { CHARACTERS } from "@/lib/emotionMap";

const STORAGE_KEY_CHAR = "hoshino_active_character";
const getStorageKeyMessages = (charId: CharacterId) => `hoshino_chat_history_${charId}`;
const getStorageKeyState = (charId: CharacterId) => `hoshino_chat_state_${charId}`;

export function useChat() {
  const [characterId, setCharacterIdState] = useState<CharacterId>("takanashi_hoshino");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>("neutral");
  const [currentCostume, setCurrentCostume] = useState<CostumeType>("default");
  const [currentBackground, setCurrentBackground] = useState<string>("committee_room");

  // Load history & state for a given character
  const loadCharacterData = useCallback((charId: CharacterId) => {
    const charMeta = CHARACTERS[charId] || CHARACTERS.takanashi_hoshino;
    let loadedMessages: ChatMessage[] = [];
    let loadedEmotion: Emotion = "neutral";
    let loadedCostume: CostumeType = charMeta.defaultCostume;
    let loadedBackground: string = charMeta.defaultBackground;

    try {
      const savedMessages = localStorage.getItem(getStorageKeyMessages(charId));
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) loadedMessages = parsed;
      }

      const savedState = localStorage.getItem(getStorageKeyState(charId));
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.emotion) loadedEmotion = parsed.emotion;
        if (parsed.costume) loadedCostume = parsed.costume;
        if (parsed.background) loadedBackground = parsed.background;
      }
    } catch {}

    setMessages(loadedMessages);
    setCurrentEmotion(loadedEmotion);
    setCurrentCostume(loadedCostume);
    setCurrentBackground(loadedBackground);
  }, []);

  // Initial client mount
  useEffect(() => {
    try {
      const savedChar = localStorage.getItem(STORAGE_KEY_CHAR) as CharacterId | null;
      const initialChar: CharacterId =
        savedChar && CHARACTERS[savedChar] ? savedChar : "takanashi_hoshino";
      setCharacterIdState(initialChar);
      loadCharacterData(initialChar);
    } catch {
      loadCharacterData("takanashi_hoshino");
    }
  }, [loadCharacterData]);

  const saveToStorage = (
    newMessages: ChatMessage[],
    emotion: Emotion,
    costume: CostumeType,
    background: string,
    charId: CharacterId = characterId
  ) => {
    try {
      localStorage.setItem(getStorageKeyMessages(charId), JSON.stringify(newMessages));
      localStorage.setItem(
        getStorageKeyState(charId),
        JSON.stringify({ emotion, costume, background })
      );
      localStorage.setItem(STORAGE_KEY_CHAR, charId);
    } catch {}
  };

  const setCharacterId = useCallback(
    (id: CharacterId) => {
      setCharacterIdState(id);
      try {
        localStorage.setItem(STORAGE_KEY_CHAR, id);
      } catch {}
      loadCharacterData(id);
    },
    [loadCharacterData]
  );

  const sendMessage = useCallback(
    async (
      text: string,
      apiKey: string,
      model?: string,
      onCharacterMessage?: (message: ChatMessage, showText: () => void) => Promise<void>
    ) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMessage = { role: "user", text, characterId };
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
            characterId,
          }),
        });

        const data = await res.json();

        if (data.error) {
          const errMsg: ChatMessage = {
            role: "hoshino",
            characterId,
            text: "Server lagi sibuk nih Sensei... Coba panggil sekali lagi ya~",
            emotion: "sleepy",
          };
          const nextMessages = [...updatedMessagesWithUser, errMsg];
          setMessages(nextMessages);
          setCurrentEmotion("sleepy");
          saveToStorage(nextMessages, "sleepy", currentCostume, currentBackground, characterId);
        } else {
          const charMsg: ChatMessage = {
            role: "hoshino",
            characterId,
            text: data.message,
            emotion: data.emotion,
            costume: data.costume,
            background: data.background,
          };
          const nextEmotion = data.emotion || currentEmotion;
          const nextCostume = data.costume || currentCostume;
          const nextBackground = data.background || currentBackground;
          const showText = () => {
            const nextMessages = [...updatedMessagesWithUser, charMsg];
            setMessages(nextMessages);
            if (data.emotion) setCurrentEmotion(data.emotion);
            if (data.costume) setCurrentCostume(data.costume);
            if (data.background) setCurrentBackground(data.background);
            saveToStorage(nextMessages, nextEmotion, nextCostume, nextBackground, characterId);
          };

          if (onCharacterMessage) await onCharacterMessage(charMsg, showText);
          else showText();
        }
      } catch {
        const errMsg: ChatMessage = {
          role: "hoshino",
          characterId,
          text: "Sensei... sepertinya koneksi terputus sebentar...",
          emotion: "sleepy",
        };
        const nextMessages = [...updatedMessagesWithUser, errMsg];
        setMessages(nextMessages);
        setCurrentEmotion("sleepy");
        saveToStorage(nextMessages, "sleepy", currentCostume, currentBackground, characterId);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, currentEmotion, currentCostume, currentBackground, characterId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentEmotion("neutral");
    try {
      localStorage.removeItem(getStorageKeyMessages(characterId));
      localStorage.removeItem(getStorageKeyState(characterId));
    } catch {}
  }, [characterId]);

  const handleManualCostumeChange = (c: CostumeType) => {
    setCurrentCostume(c);
    saveToStorage(messages, currentEmotion, c, currentBackground, characterId);
  };

  const handleManualBackgroundChange = (bg: string) => {
    setCurrentBackground(bg);
    saveToStorage(messages, currentEmotion, currentCostume, bg, characterId);
  };

  return {
    characterId,
    setCharacterId,
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


