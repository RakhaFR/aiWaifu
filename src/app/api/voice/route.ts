import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

const DEFAULT_REFERENCE_ID = "b94e6f4628ae4ec898981cc171faf42d";
type VoiceLanguage = "ja" | "id" | "en";

async function translate(text: string, language: Exclude<VoiceLanguage, "id">, apiKey: string) {
  const target = language === "ja" ? "Japanese" : "English";
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: `Translate this dialogue to natural spoken ${target}. Return only translation, no notes: ${text}`,
  });
  return response.text?.trim() || text;
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
    if (language !== "ja" && language !== "id" && language !== "en") {
      return Response.json({ error: "Invalid TTS language" }, { status: 400 });
    }
    if (language !== "id" && !geminiApiKey?.trim()) {
      return Response.json({ error: "Gemini API key is required for TTS translation" }, { status: 400 });
    }

    const voiceText = language === "id" ? text : await translate(text, language, geminiApiKey!);
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        model: "s2.1-pro-free",
      },
      body: JSON.stringify({
        text: voiceText,
        reference_id: referenceId?.trim() || DEFAULT_REFERENCE_ID,
        format: "mp3",
      }),
    });
    if (!response.ok) {
      return Response.json({ error: "Fish Audio request failed" }, { status: response.status });
    }

    return new Response(response.body, {
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "audio/mpeg" },
    });
  } catch {
    return Response.json({ error: "Voice request failed" }, { status: 500 });
  }
}
