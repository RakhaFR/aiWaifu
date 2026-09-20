"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef } from "react";
import type { Emotion } from "@/lib/emotionMap";
import { getSpriteIndex, getSpritePath } from "@/lib/emotionMap";

interface SpriteTransform {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  emotion: Emotion;
  costume: "default" | "sportswear";
  isEditMode: boolean;
}

const DEFAULT_TRANSFORM: SpriteTransform = {
  x: -80,
  y: 60,
  scale: 1.45,
};

export default function SpriteDisplay({ emotion, costume, isEditMode }: Props) {
  const [transform, setTransform] = useState<SpriteTransform>(DEFAULT_TRANSFORM);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const transformStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hoshino_sprite_transform");
      if (saved) {
        setTransform(JSON.parse(saved));
      }
    } catch {
      // fallback to default
    }
  }, []);

  const saveTransform = (t: SpriteTransform) => {
    setTransform(t);
    localStorage.setItem("hoshino_sprite_transform", JSON.stringify(t));
  };

  const spriteIdx = useMemo(() => getSpriteIndex(emotion), [emotion]);
  const src = getSpritePath(costume, spriteIdx);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    transformStart.current = { x: transform.x, y: transform.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !isEditMode) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTransform((prev) => ({
        ...prev,
        x: transformStart.current.x + dx,
        y: transformStart.current.y + dy,
      }));
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setTransform((curr) => {
          localStorage.setItem("hoshino_sprite_transform", JSON.stringify(curr));
          return curr;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isEditMode]);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const nextScale = Math.min(Math.max(0.6, transform.scale + delta), 3.0);
    saveTransform({ ...transform, scale: nextScale });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveTransform(DEFAULT_TRANSFORM);
  };

  return (
    <div
      onWheel={handleWheel}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none ${
        isEditMode ? "pointer-events-auto cursor-move" : ""
      }`}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
        }}
        className={`relative transition-transform duration-75 select-none ${
          isEditMode
            ? "ring-2 ring-cyan-400/60 ring-dashed rounded-2xl bg-cyan-950/10 backdrop-blur-[1px] p-2"
            : ""
        }`}
      >
        {isEditMode && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
            <span>Drag to Move • Scroll to Scale ({(transform.scale * 100).toFixed(0)}%)</span>
            <button
              onClick={handleReset}
              className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 px-1.5 py-0.5 rounded text-[10px]"
            >
              Reset
            </button>
          </div>
        )}

        <Image
          key={`${costume}-${spriteIdx}`}
          src={src}
          alt={`Hoshino - ${emotion}`}
          width={600}
          height={900}
          priority
          draggable={false}
          className="object-contain h-[75vh] w-auto animate-[fadeIn_0.25s_ease-in-out] drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
        />
      </div>
    </div>
  );
}
