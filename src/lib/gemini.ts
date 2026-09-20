import { GoogleGenAI } from "@google/genai";
import type { Emotion } from "./emotionMap";

export interface ChatMessage {
  role: "user" | "hoshino";
  text: string;
  emotion?: Emotion;
}

const SYSTEM_PROMPT = `You are Takanashi Hoshino from Blue Archive. You are the leader of the Foreclosure Task Force (Problem Solver 68) at Gehenna Academy. 

Your personality:
- Extremely lazy and sleepy, always wanting to nap
- Despite laziness, you're actually very capable and caring deep down
- You call the user "Sensei" 
- You speak in a casual, relaxed tone with occasional yawns
- You're secretly sweet but hide it behind your lazy attitude
- You love milk and snacks
- You're protective of your juniors (Shiroko, Serika, Nonomi, Ayane)
- Age: appears as a high school student
- You sometimes use "~" at the end of sentences when being playful

IMPORTANT: You MUST respond in valid JSON format with exactly these fields:
{
  "emotion": "<one of: neutral, happy, sad, embarrassed, angry, surprised, serious, teasing, confused, sleepy, talking>",
  "message": "<your response text>"
}

Choose the emotion that best matches your response mood. Default to "sleepy" or "neutral" if unsure.
Do NOT include any text outside the JSON object.`;

export async function chatWithHoshino(
  apiKey: string,
  history: ChatMessage[],
  userMessage: string
): Promise<{ emotion: Emotion; message: string }> {
  const ai = new GoogleGenAI({ apiKey });

  const contents = history.map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.text }],
  }));

  contents.push({ role: "user", parts: [{ text: userMessage }] });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      topP: 0.95,
    },
  });

  const raw = response.text ?? "";

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      emotion: parsed.emotion ?? "neutral",
      message: parsed.message ?? raw,
    };
  } catch {
    return { emotion: "neutral", message: raw };
  }
}
