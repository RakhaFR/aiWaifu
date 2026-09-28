"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterId } from "@/lib/emotionMap";
import { CHARACTERS } from "@/lib/emotionMap";

const STORAGE_KEY_VOICE = "hoshino_fish_audio_settings";
export type VoiceLanguage = "ja" | "id" | "en";

export interface VoicePreset {
  id: string;
  name: string;
  referenceId: string;
  characterId?: CharacterId;
}

export const DEFAULT_PRESETS: VoicePreset[] = [
  {
    id: "preset_hoshino_default",
    name: "Takanashi Hoshino (Default)",
    referenceId: CHARACTERS.takanashi_hoshino.defaultVoiceId,
    characterId: "takanashi_hoshino",
  },
  {
    id: "preset_hina_default",
    name: "Sorasaki Hina (Default)",
    referenceId: CHARACTERS.sorasaki_hina.defaultVoiceId,
    characterId: "sorasaki_hina",
  },
  {
    id: "preset_ichika_default",
    name: "Nakamasa Ichika (Default)",
    referenceId: CHARACTERS.nakamasa_ichika.defaultVoiceId,
    characterId: "nakamasa_ichika",
  },
];

interface VoiceSettings {
  enabled: boolean;
  apiKey: string;
  referenceId: string;
  language: VoiceLanguage;
  presets: VoicePreset[];
}

const defaults: VoiceSettings = {
  enabled: false,
  apiKey: "",
  referenceId: CHARACTERS.takanashi_hoshino.defaultVoiceId,
  language: "ja",
  presets: DEFAULT_PRESETS,
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
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({
            ...defaults,
            ...parsed,
            presets: parsed.presets && parsed.presets.length > 0 ? parsed.presets : DEFAULT_PRESETS,
          });
        }
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

  const addPreset = useCallback(
    (name: string, referenceId: string, characterId?: CharacterId) => {
      if (!name.trim() || !referenceId.trim()) return;
      const newPreset: VoicePreset = {
        id: `preset_${Date.now()}`,
        name: name.trim(),
        referenceId: referenceId.trim(),
        characterId,
      };
      const nextPresets = [...settings.presets, newPreset];
      updateSettings({ presets: nextPresets, referenceId: newPreset.referenceId });
    },
    [settings.presets, updateSettings]
  );

  const deletePreset = useCallback(
    (id: string) => {
      const nextPresets = settings.presets.filter((p) => p.id !== id);
      updateSettings({ presets: nextPresets });
    },
    [settings.presets, updateSettings]
  );

  const selectPreset = useCallback(
    (referenceId: string) => {
      updateSettings({ referenceId });
    },
    [updateSettings]
  );

  const speak = useCallback(
    async (
      text: string,
      geminiApiKey: string,
      showText: () => void,
      fallbackVoiceId?: string
    ) => {
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

      const finalVoiceId =
        settings.referenceId.trim() ||
        fallbackVoiceId ||
        CHARACTERS.takanashi_hoshino.defaultVoiceId;

      try {
        const response = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            apiKey: settings.apiKey.trim(),
            referenceId: finalVoiceId,
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
    presets: settings.presets,
    addPreset,
    deletePreset,
    selectPreset,
    isPlaying,
    isFetching,
    skipAudio: () => skipRef.current?.(),
    speak,
    stop,
  };
}

