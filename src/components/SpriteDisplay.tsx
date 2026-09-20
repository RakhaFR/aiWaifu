"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { Emotion } from "@/lib/emotionMap";
import { getSpriteIndex, getSpritePath } from "@/lib/emotionMap";

interface Props {
  emotion: Emotion;
  costume: "default" | "sportswear";
}

export default function SpriteDisplay({ emotion, costume }: Props) {
  const spriteIdx = useMemo(() => getSpriteIndex(emotion), [emotion]);
  const src = getSpritePath(costume, spriteIdx);

  return (
    <div className="relative flex items-end justify-center flex-1 min-h-0 pb-2 pointer-events-none select-none">
      <Image
        key={`${costume}-${spriteIdx}`}
        src={src}
        alt={`Hoshino - ${emotion}`}
        width={400}
        height={600}
        priority
        className="object-contain max-h-[60vh] w-auto animate-[fadeIn_0.3s_ease-in-out]"
      />
    </div>
  );
}
