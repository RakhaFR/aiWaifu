import { NextRequest, NextResponse } from "next/server";
import { chatWithHoshino, type ChatMessage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, history, apiKey, model } = (await req.json()) as {
      message: string;
      history: ChatMessage[];
      apiKey: string;
      model?: string;
    };

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required" },
        { status: 400 }
      );
    }

    const result = await chatWithHoshino(apiKey, history, message, model);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
