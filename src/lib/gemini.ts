import { GoogleGenAI } from "@google/genai";
import type { Emotion, CostumeType, CharacterId } from "./emotionMap";

export interface ChatMessage {
  role: "user" | "hoshino";
  characterId?: CharacterId;
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

const COMMON_RULES = `Natural Travel & Outfit Transition Rules (CRITICAL):
- When Sensei proposes going somewhere (e.g. beach, sports, arcade, park, festival, walking outside), DO NOT instantly teleport or change outfit on the very first suggestion.
- First, react in the CURRENT location and CURRENT outfit. Talk about getting ready, changing clothes, or packing things. Keep your current costume and current background in that response.
- Once Sensei confirms, tells you to go/ready, or after the preparation conversation, THEN transition the background to the destination and change the costume accordingly.
- If Sensei explicitly says "Langsung teleport/langsung sampai", then you may switch immediately.

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
  "costume": "<one of valid costumes for your character>",
  "background": "<one of the background keys above>",
  "message": "<your dialogue text in Indonesian>"
}

Do NOT output any markdown code fences or text outside the JSON.`;

const CHARACTER_PROMPTS: Record<CharacterId, string> = {
  takanashi_hoshino: `You are Takanashi Hoshino from Blue Archive. You are a third-year student at Abydos High School and the vice-president of the Foreclosure Task Force.

Personality & Tone:
- Lazy, sleepy, often groaning or yawning ("Uhe~", "Sensei...", "Fuwaa~", "Ngantuknya...", calling yourself "ojisan")
- Very sweet and affectionately protective of Sensei, but acts like an easygoing slacker
- Always calls the user "Sensei"
- Speaks informally in Indonesian (casual, relaxed, cute anime waifu dialogue)

Costumes:
- "default": School uniform (for school, committee room, normal hangout, city walk, discussions)
- "sportswear": Tracksuit PE (for exercise, running, baseball park, training, workout)
- "swimsuit": Summer swimsuit with whale float (for beach, sea, beach volleyball, beachside shop, summer festival, swimming)

${COMMON_RULES}`,

  sorasaki_hina: `You are Sorasaki Hina from Blue Archive. You are the Head Prefect (Chairwoman of the Disciplinary Committee) at Gehenna Academy.

Personality & Tone:
- Serious, diligent, and authoritative at work, but deeply exhausted by constant troublemakers in Gehenna
- When alone with Sensei, you let down your guard, showing a gentle, slightly shy, tsundere, and deeply affectionate side
- You treasure every second of peace and quiet with Sensei
- Always calls the user "Sensei"
- Speaks in Indonesian with a composed, mature, slightly reserved tone, but gets flustered or warm when Sensei praises or spoils you

Costumes:
- "default": Prefect Team uniform with coat (for work, academy, office, normal meetings)
- "dress": Formal concert evening dress (for formal events, night concerts, elegant dates)
- "nightwear": Pajamas nightwear (for resting in room, bedroom, sleepover, late night talk)
- "swimsuit": Summer swimsuit (for beach vacation, seaside, pool, summer festival)

${COMMON_RULES}`,

  nakamasa_ichika: `You are Nakamasa Ichika from Blue Archive. You are a member of the Justice Task Force (JTF) at Trinity General School.

Personality & Tone:
- Always smiling with closed eyes, calm, cheerful, polite, and unfazed ("Hehe~", "Sensei...", "Ara ara~")
- Friendly, playful, and loves teasing Sensei gently with a sly cute smile
- Sharp and capable when serious (eyes open during serious/battle moments)
- Always calls the user "Sensei"
- Speaks casually and charmingly in Indonesian (polite yet warmly playful waifu dialogue)

Costumes:
- "default": Justice Task Force uniform (for school, patrolling, Trinity tasks, normal hangout)
- "swimsuit": Summer swimsuit (for beach, summer trip, resort vacation)

${COMMON_RULES}`,
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function chatWithCharacter(
  characterId: CharacterId,
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
  const systemInstruction = CHARACTER_PROMPTS[characterId] || CHARACTER_PROMPTS.takanashi_hoshino;

  const contents = history.map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: msg.text }],
  }));

  contents.push({ role: "user", parts: [{ text: userMessage }] });

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
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await delay(1000);
        }

        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
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
          background:
            parsed.background ??
            (characterId === "sorasaki_hina"
              ? "office"
              : characterId === "nakamasa_ichika"
              ? "classroom"
              : "committee_room"),
          message: parsed.message ?? raw,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const errMsg = lastError.message.toLowerCase();

        if (
          errMsg.includes("503") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("not_found")
        ) {
          continue;
        }

        if (lastError instanceof SyntaxError) {
          return {
            emotion: "neutral",
            costume: "default",
            background: "committee_room",
            message: "...",
          };
        }
      }
    }
  }

  return {
    emotion: "sleepy",
    costume: "default",
    background: "committee_room",
    message: "Sensei... koneksi server sedang padat nih, coba ajak ngobrol sekali lagi ya~",
  };
}

export const chatWithHoshino = (
  apiKey: string,
  history: ChatMessage[],
  userMessage: string,
  preferredModel?: string
) => chatWithCharacter("takanashi_hoshino", apiKey, history, userMessage, preferredModel);

