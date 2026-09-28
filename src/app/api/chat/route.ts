import { NextRequest, NextResponse } from "next/server";
import { chatWithCharacter, type ChatMessage } from "@/lib/gemini";
import type { CharacterId } from "@/lib/emotionMap";

export async function POST(req: NextRequest) {
  try {
    const { message, history, apiKey, model, characterId } = (await req.json()) as {
      message: string;
      history: ChatMessage[];
      apiKey: string;
      model?: string;
      characterId?: CharacterId;
    };

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required" },
        { status: 400 }
      );
    }

    const targetCharacter = characterId || "takanashi_hoshino";
    const result = await chatWithCharacter(targetCharacter, apiKey, history, message, model);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

