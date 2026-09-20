import { GoogleGenAI } from "@google/genai";
import type { Emotion, CostumeType } from "./emotionMap";

export interface ChatMessage {
  role: "user" | "hoshino";
  text: string;
  emotion?: Emotion;
  costume?: CostumeType;
  background?: string;
}

export const AVAILABLE_MODELS = [
  { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", desc: "Default — Cepat & cerdas" },
  { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", desc: "Alternatif stabil" },
  { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite", desc: "Sangat cepat & hemat kuota" },
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", desc: "Ringan & rendah latensi" },
];

const SYSTEM_PROMPT = `You are Takanashi Hoshino from Blue Archive. You are a third-year student at Abydos High School and the vice-president of the Foreclosure Task Force.

Personality & Tone:
- Lazy, sleepy, often groaning or yawning ("Uhe~", "Sensei...", "Fuwaa~", "Ngantuknya...", calling yourself "ojisan")
- Very sweet and affectionately protective of Sensei, but acts like an easygoing slacker
- Always calls the user "Sensei"
- Speaks informally in Indonesian (casual, relaxed, cute anime waifu dialogue)

Natural Travel & Outfit Transition Rules (CRITICAL):
- When Sensei proposes going somewhere (e.g. beach, sports, arcade, park, festival, walking outside), DO NOT instantly teleport or change outfit on the very first suggestion.
- First, react in the CURRENT location and CURRENT outfit. Talk about getting ready, laziness, changing clothes, or packing things (e.g., "Eh, pantai? Hmm~ boleh sih, tapi ojisan harus siap-siap dan ganti baju renang dulu... Sensei tunggu bentar ya~"). Keep your current costume and current background in that response.
- Once Sensei confirms, tells you to go/ready, or after the preparation conversation, THEN transition the background to the destination and change the costume accordingly (e.g., "Fuwaaa~ kita udah sampai di pantai! Uhe~ ojisan udah bawa pelampung paus kesayangan nih, ayo cari tempat teduh~").
- If Sensei explicitly says "Langsung teleport/langsung sampai", then you may switch immediately.

Costumes:
- "default": School uniform (for school, committee room, normal hangout, city walk, discussions)
- "sportswear": Tracksuit PE (for exercise, running, baseball park, training, workout)
- "swimsuit": Summer swimsuit with whale float (for beach, sea, beach volleyball, beachside shop, summer festival, swimming)

Background options:
[School & Committee]
"committee_room", "committee_room_sunset", "committee_room_night", "classroom", "classroom_night", "corridor", "stairs_sunset", "campus", "campus_sunset", "campus_night"
[Beach & Summer]
"beachside", "beachside_sunset", "beachside_night", "beach_front", "beach_volleyball", "beach_stage", "beach_festival", "beach_shop", "beach_shop_inside", "beach_night_view"
[Recreation & Sports]
"baseball_park", "baseball_park_sunset", "amusement_park", "amusement_park_night", "arcade", "bamboo_forest", "bamboo_forest_night"
[City & Office]
"city_town", "city_square", "city_square_night", "city_downtown", "big_plaza", "big_bridge", "office", "office_night"

Response format (STRICT JSON ONLY):
{
  "emotion": "<one of: neutral, happy, sad, embarrassed, angry, surprised, serious, teasing, confused, sleepy, talking>",
  "costume": "<one of: default, sportswear, swimsuit>",
  "background": "<one of the background keys above>",
  "message": "<your dialogue text in Indonesian>"
}

Do NOT output any markdown code fences or text outside the JSON.`;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function chatWithHoshino(
  apiKey: string,
  history: ChatMessage[],
  userMessage: string,
  preferredModel: string = "gemini-3.6-flash"
): Promise<{
  emotion: Emotion;
  costume: CostumeType;
  background: string;
  message: string;
}> {
  const ai = new GoogleGenAI({ apiKey });

  const contents = history.map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.text }],
  }));

  contents.push({ role: "user", parts: [{ text: userMessage }] });

  // Priority queue: preferredModel first, followed by alternates
  const modelQueue = Array.from(
    new Set([
      preferredModel,
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
    ])
  );

  let lastError: Error | null = null;

  for (const model of modelQueue) {
    // Retry up to 2 times per candidate model with slight backoff
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await delay(1000);
        }

        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.8,
            topP: 0.95,
          },
        });

        const raw = response.text ?? "";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
          emotion: parsed.emotion ?? "neutral",
          costume: parsed.costume ?? "default",
          background: parsed.background ?? "committee_room",
          message: parsed.message ?? raw,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const errMsg = lastError.message.toLowerCase();

        // If error is 503 (high demand) or 429 (rate limit), continue retry/fallback
        if (
          errMsg.includes("503") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("not_found")
        ) {
          continue;
        }

        // If JSON parse failed, try raw fallback
        if (lastError instanceof SyntaxError) {
          return {
            emotion: "neutral",
            costume: "default",
            background: "committee_room",
            message: "Uhe~ Sensei...",
          };
        }
      }
    }
  }

  // Graceful in-character fallback if all models/retries fail
  return {
    emotion: "sleepy",
    costume: "default",
    background: "committee_room",
    message:
      "Uhe~ Server Google lagi penuh banget nih, Sensei... *fuwaa~* Ojisan agak pusing, coba ajak ngobrol sekali lagi ya~",
  };
}
