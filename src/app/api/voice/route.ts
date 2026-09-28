import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const DEFAULT_REFERENCE_ID = "b94e6f4628ae4ec898981cc171faf42d";
type VoiceLanguage = "ja" | "id" | "en";

async function translate(text: string, language: Exclude<VoiceLanguage, "id">, apiKey: string) {
  const target = language === "ja" ? "Japanese" : "English";
  const models = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.1-flash-lite"];
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Translate this dialogue to natural spoken ${target}. Return only translation, no notes: ${text}`,
        });
        const translated = response.text?.trim();
        if (translated) return translated;
      } catch (e) {
        console.warn(`Translation attempt with ${model} failed, trying next:`, e);
      }
    }
  } catch (err) {
    console.warn("Translation initialization failed, falling back to original text:", err);
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { text, apiKey, referenceId, language, geminiApiKey } = (await req.json()) as {
      text?: string;
      apiKey?: string;
      referenceId?: string;
      language?: VoiceLanguage;
      geminiApiKey?: string;
    };

    if (!text?.trim() || !apiKey?.trim()) {
      return Response.json({ error: "Text and Fish Audio API key are required" }, { status: 400 });
    }

    const ttsLanguage: VoiceLanguage = language === "ja" || language === "en" || language === "id" ? language : "ja";

    let voiceText = text.trim();
    if (ttsLanguage !== "id" && geminiApiKey?.trim()) {
      voiceText = await translate(voiceText, ttsLanguage, geminiApiKey.trim());
    }

    const refId = referenceId?.trim() || DEFAULT_REFERENCE_ID;

    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        model: "s2.1-pro-free",
      },
      body: JSON.stringify({
        text: voiceText,
        reference_id: refId,
        format: "mp3",
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Fish Audio API error:", response.status, errText);
      return Response.json(
        { error: `Fish Audio failed (${response.status}): ${errText}` },
        { status: response.status }
      );
    }

    return new Response(response.body, {
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "audio/mpeg" },
    });
  } catch (err) {
    console.error("Voice route error:", err);
    const msg = err instanceof Error ? err.message : "Voice request failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}

