"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef } from "react";
import type { Emotion, CostumeType } from "@/lib/emotionMap";
import { getSpriteIndex, getSpritePath } from "@/lib/emotionMap";

interface SpriteTransform {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  emotion: Emotion;
  costume: CostumeType;
  isEditMode: boolean;
  isThinking: boolean;
  onPositionChange?: (pos: SpriteTransform) => void;
}

const DEFAULT_TRANSFORM: SpriteTransform = {
  x: -180,
  y: 60,
  scale: 1.35,
};

export default function SpriteDisplay({
  emotion,
  costume,
  isEditMode,
  isThinking,
  onPositionChange,
}: Props) {
  const [transform, setTransform] = useState<SpriteTransform>(DEFAULT_TRANSFORM);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const transformStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hoshino_sprite_transform");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTransform(parsed);
        onPositionChange?.(parsed);
      } else {
        onPositionChange?.(DEFAULT_TRANSFORM);
      }
    } catch {
      onPositionChange?.(DEFAULT_TRANSFORM);
    }
  }, [onPositionChange]);

  const saveTransform = (t: SpriteTransform) => {
    setTransform(t);
    onPositionChange?.(t);
    localStorage.setItem("hoshino_sprite_transform", JSON.stringify(t));
  };

  const effectiveEmotion: Emotion = isThinking ? "thinking" : emotion;
  const spriteIdx = useMemo(
    () => getSpriteIndex(costume, effectiveEmotion),
    [costume, effectiveEmotion]
  );
  const src = getSpritePath(costume, spriteIdx);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    transformStart.current = { x: transform.x, y: transform.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !isEditMode) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const nextTransform = {
        ...transform,
        x: Math.round(transformStart.current.x + dx),
        y: Math.round(transformStart.current.y + dy),
      };
      setTransform(nextTransform);
      onPositionChange?.(nextTransform);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setTransform((curr) => {
          localStorage.setItem("hoshino_sprite_transform", JSON.stringify(curr));
          onPositionChange?.(curr);
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
  }, [isEditMode, transform, onPositionChange]);

  // Non-passive wheel event to reliably zoom
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      if (!isEditMode) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      setTransform((prev) => {
        const nextScale = Math.min(Math.max(0.5, +(prev.scale + delta).toFixed(2)), 3.5);
        const updated = { ...prev, scale: nextScale };
        localStorage.setItem("hoshino_sprite_transform", JSON.stringify(updated));
        onPositionChange?.(updated);
        return updated;
      });
    };

    el.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", handleWheelNative);
  }, [isEditMode, onPositionChange]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveTransform(DEFAULT_TRANSFORM);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden select-none ${
        isEditMode
          ? "z-30 pointer-events-auto cursor-grab active:cursor-grabbing bg-black/20"
          : "z-10 pointer-events-none"
      }`}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "center center",
        }}
        className={`relative transition-none select-none ${
          isEditMode
            ? "ring-2 ring-cyan-400 ring-dashed rounded-2xl bg-cyan-950/20 backdrop-blur-[2px] p-4 cursor-grab active:cursor-grabbing shadow-[0_0_40px_rgba(6,182,212,0.3)]"
            : ""
        }`}
      >
        {isEditMode && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d1424] border border-cyan-400/80 text-cyan-200 text-xs px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap z-50">
            <span className="font-semibold text-cyan-400">Mode Atur Posisi</span>
            <span>Drag Sprite • Scroll Mouse ({(transform.scale * 100).toFixed(0)}%)</span>
            <button
              onClick={handleReset}
              className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
            >
              Reset Posisi
            </button>
          </div>
        )}

        <Image
          key={`${costume}-${spriteIdx}`}
          src={src}
          alt={`Hoshino - ${effectiveEmotion}`}
          width={650}
          height={950}
          priority
          draggable={false}
          className="object-contain h-[78vh] w-auto animate-[fadeIn_0.15s_ease-in-out] drop-shadow-[0_12px_35px_rgba(0,0,0,0.7)] pointer-events-none"
        />
      </div>
    </div>
  );
}
