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
  | "talking"
  | "thinking";

export type CharacterId =
  | "takanashi_hoshino"
  | "sorasaki_hina"
  | "nakamasa_ichika";

export type CostumeType =
  | "default"
  | "sportswear"
  | "swimsuit"
  | "dress"
  | "nightwear";

export interface CharacterMeta {
  id: CharacterId;
  name: string;
  fullName: string;
  jpName: string;
  school: string;
  unit: string;
  defaultVoiceId: string;
  defaultBackground: string;
  defaultCostume: CostumeType;
  costumes: { id: CostumeType; name: string; desc: string }[];
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  takanashi_hoshino: {
    id: "takanashi_hoshino",
    name: "Hoshino",
    fullName: "Takanashi Hoshino",
    jpName: "小鳥遊ホシノ",
    school: "Abydos High School",
    unit: "Foreclosure Task Force",
    defaultVoiceId: "b94e6f4628ae4ec898981cc171faf42d",
    defaultBackground: "committee_room",
    defaultCostume: "default",
    costumes: [
      { id: "default", name: "Uniform (Abydos High)", desc: "Seragam sekolah klasik Abydos" },
      { id: "sportswear", name: "Sportswear (PE Tracksuit)", desc: "Baju olahraga / senam sekolah" },
      { id: "swimsuit", name: "Swimsuit (Summer Diorama)", desc: "Baju renang + pelampung paus" },
    ],
  },
  sorasaki_hina: {
    id: "sorasaki_hina",
    name: "Hina",
    fullName: "Sorasaki Hina",
    jpName: "空崎ヒナ",
    school: "Gehenna Academy",
    unit: "Head Prefect Team",
    defaultVoiceId: "ffa3fa64f7604f35a102444c10e1ace3",
    defaultBackground: "office",
    defaultCostume: "default",
    costumes: [
      { id: "default", name: "Prefect Uniform", desc: "Seragam resmi ketua komite Gehenna" },
      { id: "dress", name: "Formal Concert Dress", desc: "Gaun mewah konser & festival malam" },
      { id: "nightwear", name: "Pajamas (Nightwear)", desc: "Piyama santai kamar istirahat" },
      { id: "swimsuit", name: "Summer Swimsuit", desc: "Baju renang liburan musim panas" },
    ],
  },
  nakamasa_ichika: {
    id: "nakamasa_ichika",
    name: "Ichika",
    fullName: "Nakamasa Ichika",
    jpName: "仲正イチカ",
    school: "Trinity General School",
    unit: "Justice Task Force",
    defaultVoiceId: "277f5a5235194a07a2f8fd60c8720648",
    defaultBackground: "classroom",
    defaultCostume: "default",
    costumes: [
      { id: "default", name: "Justice Task Force Uniform", desc: "Seragam komite disiplin Trinity" },
      { id: "swimsuit", name: "Summer Swimsuit", desc: "Baju renang santai liburan pantai" },
    ],
  },
};

export const EMOTION_SPRITES_HOSHINO: Record<string, Record<Emotion, number>> = {
  default: {
    neutral: 0,
    happy: 9,
    sad: 5,
    embarrassed: 6,
    angry: 12,
    surprised: 4,
    serious: 8,
    teasing: 15,
    confused: 14,
    sleepy: 17,
    talking: 3,
    thinking: 2,
  },
  sportswear: {
    neutral: 0,
    happy: 7,
    sad: 5,
    embarrassed: 6,
    angry: 12,
    surprised: 4,
    serious: 8,
    teasing: 15,
    confused: 14,
    sleepy: 17,
    talking: 3,
    thinking: 2,
  },
  swimsuit: {
    neutral: 1,
    happy: 3,
    sad: 5,
    embarrassed: 15,
    angry: 12,
    surprised: 4,
    serious: 10,
    teasing: 0,
    confused: 11,
    sleepy: 20,
    talking: 17,
    thinking: 20,
  },
};

export const EMOTION_SPRITES_HINA: Record<string, Record<Emotion, number>> = {
  default: {
    neutral: 0,
    happy: 2,
    sad: 11,
    embarrassed: 5,
    angry: 7,
    surprised: 9,
    serious: 8,
    teasing: 1,
    confused: 10,
    sleepy: 12,
    talking: 3,
    thinking: 14,
  },
  dress: {
    neutral: 0,
    happy: 2,
    sad: 9,
    embarrassed: 5,
    angry: 7,
    surprised: 8,
    serious: 6,
    teasing: 1,
    confused: 10,
    sleepy: 12,
    talking: 3,
    thinking: 4,
  },
  nightwear: {
    neutral: 0,
    happy: 2,
    sad: 4,
    embarrassed: 3,
    angry: 5,
    surprised: 6,
    serious: 0,
    teasing: 2,
    confused: 4,
    sleepy: 0,
    talking: 2,
    thinking: 3,
  },
  swimsuit: {
    neutral: 0,
    happy: 2,
    sad: 5,
    embarrassed: 4,
    angry: 7,
    surprised: 6,
    serious: 8,
    teasing: 1,
    confused: 3,
    sleepy: 10,
    talking: 1,
    thinking: 9,
  },
};

export const EMOTION_SPRITES_ICHIKA: Record<string, Record<Emotion, number>> = {
  default: {
    neutral: 0,
    happy: 1,
    sad: 11,
    embarrassed: 9,
    angry: 8,
    surprised: 5,
    serious: 7,
    teasing: 3,
    confused: 6,
    sleepy: 12,
    talking: 2,
    thinking: 4,
  },
  swimsuit: {
    neutral: 0,
    happy: 2,
    sad: 11,
    embarrassed: 9,
    angry: 8,
    surprised: 5,
    serious: 7,
    teasing: 4,
    confused: 6,
    sleepy: 12,
    talking: 1,
    thinking: 10,
  },
};

export const BACKGROUND_MAP: Record<string, string> = {
  // Committee & School
  committee_room: "/scenery/BG_CommitteeRoom.jpg",
  committee_room_sunset: "/scenery/BG_CommitteeRoom_Sunset.jpg",
  committee_room_night: "/scenery/BG_CommitteeRoom_Night.jpg",
  committee_room2: "/scenery/BG_CommitteeRoom2.jpg",
  classroom: "/scenery/BG_ClassRoom.jpg",
  classroom_night: "/scenery/BG_ClassRoom_Night.jpg",
  classroom2: "/scenery/BG_ClassRoom2.jpg",
  classroom2_night: "/scenery/BG_ClassRoom2_Night.jpg",
  corridor: "/scenery/BG_ClassCorridor.jpg",
  corridor_night: "/scenery/BG_ClassCorridor_Night.jpg",
  stairs: "/scenery/BG_ClassStairs.jpg",
  stairs_sunset: "/scenery/BG_ClassStairs_Sunset.jpg",
  stairs_night: "/scenery/BG_ClassStairs_Night.jpg",
  campus: "/scenery/BG_Campus.jpg",
  campus_sunset: "/scenery/BG_Campus_Sunset.jpg",
  campus_night: "/scenery/BG_Campus_Night.jpg",

  // Beach & Summer
  beachside: "/scenery/BG_Beachside.jpg",
  beachside_sunset: "/scenery/BG_Beachside_Sunset.jpg",
  beachside_night: "/scenery/BG_Beachside_Night.jpg",
  beach_front: "/scenery/BG_BeachFrontSide.jpg",
  beach_front_sunset: "/scenery/BG_BeachFrontSide_Sunset.jpg",
  beach_front_night: "/scenery/BG_BeachFrontSide_Night.jpg",
  beach_volleyball: "/scenery/BG_BeachVolleyball.jpg",
  beach_stage: "/scenery/BG_BeachStage.jpg",
  beach_stage_sunset: "/scenery/BG_BeachStage_Sunset.jpg",
  beach_stage_night: "/scenery/BG_BeachStage_Night.jpg",
  beach_festival: "/scenery/BG_BeachFestival.jpg",
  beach_festival_sunset: "/scenery/BG_BeachFestival_Sunset.jpg",
  beach_festival_night: "/scenery/BG_BeachFestival_Night.jpg",
  beach_shop: "/scenery/BG_BeachsideShop.jpg",
  beach_shop_sunset: "/scenery/BG_BeachsideShop_Sunset.jpg",
  beach_shop_night: "/scenery/BG_BeachsideShop_Night.jpg",
  beach_shop_inside: "/scenery/BG_BeachShopInSide.jpg",
  beach_night_view: "/scenery/BG_BeachNightView.jpg",

  // Sports & Recreation
  baseball_park: "/scenery/BG_BaseballPark.jpg",
  baseball_park_sunset: "/scenery/BG_BaseballPark_Sunset.jpg",
  amusement_park: "/scenery/BG_Amusement.jpg",
  amusement_park_night: "/scenery/BG_Amusement_Night.jpg",
  arcade: "/scenery/BG_Arcade.jpg",
  bamboo_forest: "/scenery/BG_BambooForest.jpg",
  bamboo_forest_sunset: "/scenery/BG_BambooForest_Sunset.jpg",
  bamboo_forest_night: "/scenery/BG_BambooForest_Night.jpg",

  // City & Urban
  city_town: "/scenery/BG_CityTown.jpg",
  city_square: "/scenery/BG_CitySqaure.jpg",
  city_square_night: "/scenery/BG_CitySqaure_Night.jpg",
  city_downtown: "/scenery/BG_CityDowntown.jpg",
  city_downtown_night: "/scenery/BG_CityDowntown_Night.jpg",
  big_plaza: "/scenery/BG_BigPlaza.jpg",
  big_plaza_sunset: "/scenery/BG_BigPlaza_Sunset.jpg",
  big_plaza_night: "/scenery/BG_BigPlaza_Night.jpg",
  big_bridge: "/scenery/BG_BigBridge.jpg",
  big_bridge_night: "/scenery/BG_BigBridge_Night.jpg",
  office: "/scenery/BG_CityOffice.jpg",
  office_night: "/scenery/BG_CityOffice_Night.jpg",
};

export function getSpriteIndex(
  character: CharacterId,
  costume: CostumeType,
  emotion: Emotion
): number {
  let mapGroup = EMOTION_SPRITES_HOSHINO;
  if (character === "sorasaki_hina") mapGroup = EMOTION_SPRITES_HINA;
  if (character === "nakamasa_ichika") mapGroup = EMOTION_SPRITES_ICHIKA;

  const costMap = mapGroup[costume] || mapGroup["default"] || mapGroup[Object.keys(mapGroup)[0]];
  return costMap[emotion] ?? 0;
}

export function getSpritePath(
  character: CharacterId,
  costume: CostumeType,
  index: number
): string {
  const pad = String(index).padStart(2, "0");

  if (character === "sorasaki_hina") {
    if (costume === "dress") return `/sprites/sorasaki_hina/dress/Hina_(Dress)_${pad}.png`;
    if (costume === "nightwear") return `/sprites/sorasaki_hina/nightwear/Hina_(Nightwear)_${pad}.png`;
    if (costume === "swimsuit") return `/sprites/sorasaki_hina/swimsuit/Hina_(Swimsuit)_diorama_${pad}.png`;
    return `/sprites/sorasaki_hina/default/Hina_${pad}.png`;
  }

  if (character === "nakamasa_ichika") {
    if (costume === "swimsuit") return `/sprites/nakamasa_ichika/swimsuit/Ichika_(Swimsuit)_${pad}.png`;
    return `/sprites/nakamasa_ichika/default/Ichika_${pad}.png`;
  }

  // takanashi_hoshino
  if (costume === "swimsuit") {
    return `/sprites/takanashi_hoshino/swimsuit/Hoshino_(Swimsuit)_diorama_${pad}.png`;
  }
  if (costume === "sportswear") {
    return `/sprites/takanashi_hoshino/sportswear/Hoshino_(Sportswear)_${pad}.png`;
  }
  return `/sprites/takanashi_hoshino/default/Hoshino_${pad}.png`;
}

