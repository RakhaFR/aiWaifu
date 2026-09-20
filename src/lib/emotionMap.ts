export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "embarrassed"
  | "angry"
  | "surprised"
  | "serious"
  | "teasing"
  | "confused"
  | "sleepy"
  | "talking";

export const EMOTION_SPRITES: Record<Emotion, number[]> = {
  neutral: [0, 1],
  happy: [9, 10],
  sad: [5, 13],
  embarrassed: [6, 16],
  angry: [7, 12],
  surprised: [4, 11],
  serious: [8, 18],
  teasing: [15],
  confused: [14],
  sleepy: [2, 17],
  talking: [3],
};

export const ALL_EMOTIONS: Emotion[] = Object.keys(EMOTION_SPRITES) as Emotion[];

export function getSpriteIndex(emotion: Emotion): number {
  const indices = EMOTION_SPRITES[emotion] ?? EMOTION_SPRITES.neutral;
  return indices[Math.floor(Math.random() * indices.length)];
}

export function getSpritePath(
  costume: "default" | "sportswear",
  index: number
): string {
  const pad = String(index).padStart(2, "0");
  if (costume === "sportswear") {
    return `/sprites/sportswear/Hoshino_(Sportswear)_${pad}.png`;
  }
  return `/sprites/default/Hoshino_${pad}.png`;
}
