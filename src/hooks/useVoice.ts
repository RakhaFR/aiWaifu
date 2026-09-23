"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY_VOICE = "hoshino_fish_audio_settings";
const DEFAULT_REFERENCE_ID = "b94e6f4628ae4ec898981cc171faf42d";
export type VoiceLanguage = "ja" | "id" | "en";

interface VoiceSettings {
  enabled: boolean;
  apiKey: string;
  referenceId: string;
  language: VoiceLanguage;
}

const defaults: VoiceSettings = {
  enabled: false,
  apiKey: "",
  referenceId: DEFAULT_REFERENCE_ID,
  language: "ja",
};

export function useVoice() {
  const [settings, setSettings] = useState<VoiceSettings>(defaults);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const skipRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_VOICE);
        if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
      } catch {}
    });
  }, []);

  const updateSettings = useCallback((changes: Partial<VoiceSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...changes };
      try {
        localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    skipRef.current = null;
    setIsPlaying(false);
    setIsFetching(false);
  }, []);

  useEffect(() => stop, [stop]);

  const speak = useCallback(
    async (text: string, geminiApiKey: string, showText: () => void) => {
      if (!settings.enabled || !settings.apiKey.trim() || !text.trim()) {
        showText();
        return;
      }

      stop();
      setIsFetching(true);
      let shown = false;
      const reveal = () => {
        if (shown) return;
        shown = true;
        showText();
      };
      let finish: () => void = () => {};
      const ready = new Promise<void>((resolve) => {
        finish = resolve;
      });
      skipRef.current = () => {
        reveal();
        finish();
      };

      try {
        const response = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            apiKey: settings.apiKey.trim(),
            referenceId: settings.referenceId.trim() || DEFAULT_REFERENCE_ID,
            language: settings.language,
            geminiApiKey,
          }),
        });
        if (!response.ok) throw new Error("Fish Audio request failed");

        const audioUrl = URL.createObjectURL(await response.blob());
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audioUrlRef.current = audioUrl;
        audio.onended = audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          if (audioUrlRef.current === audioUrl) audioUrlRef.current = null;
          if (audioRef.current === audio) audioRef.current = null;
          setIsPlaying(false);
        };
        audio.oncanplaythrough = () => {
          audio.oncanplaythrough = null;
          skipRef.current = null;
          reveal();
          finish();
          setIsFetching(false);
          setIsPlaying(true);
          void audio.play().catch(() => setIsPlaying(false));
        };
        audio.load();
      } catch {
        skipRef.current = null;
        reveal();
        finish();
        setIsFetching(false);
        setIsPlaying(false);
      }
      await ready;
    },
    [settings, stop]
  );

  return {
    voiceEnabled: settings.enabled,
    setVoiceEnabled: (enabled: boolean) => updateSettings({ enabled }),
    fishAudioApiKey: settings.apiKey,
    setFishAudioApiKey: (apiKey: string) => updateSettings({ apiKey }),
    fishAudioReferenceId: settings.referenceId,
    setFishAudioReferenceId: (referenceId: string) => updateSettings({ referenceId }),
    voiceLanguage: settings.language,
    setVoiceLanguage: (language: VoiceLanguage) => updateSettings({ language }),
    isPlaying,
    isFetching,
    skipAudio: () => skipRef.current?.(),
    speak,
    stop,
  };
}
