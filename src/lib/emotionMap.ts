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

export type CostumeType = "default" | "sportswear" | "swimsuit";

export const EMOTION_SPRITES_DEFAULT: Record<Emotion, number> = {
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
};

export const EMOTION_SPRITES_SWIMSUIT: Record<Emotion, number> = {
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

export function getSpriteIndex(costume: CostumeType, emotion: Emotion): number {
  const map = costume === "swimsuit" ? EMOTION_SPRITES_SWIMSUIT : EMOTION_SPRITES_DEFAULT;
  return map[emotion] ?? (costume === "swimsuit" ? 1 : 0);
}

export function getSpritePath(costume: CostumeType, index: number): string {
  const pad = String(index).padStart(2, "0");
  if (costume === "swimsuit") {
    return `/sprites/swimsuit/Hoshino_(Swimsuit)_diorama_${pad}.png`;
  }
  if (costume === "sportswear") {
    return `/sprites/sportswear/Hoshino_(Sportswear)_${pad}.png`;
  }
  return `/sprites/default/Hoshino_${pad}.png`;
}
