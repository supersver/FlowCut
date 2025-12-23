"use client";

import React from "react";

interface SceneBlockProps {
  scene: {
    id: string;
    name: string;
    startFrame: number;
    endFrame: number;
    color: string;
  };
  durationInFrames: number;
  isActive: boolean;
  onSeek?: (frame: number) => void;
}

export const SceneBlock: React.FC<SceneBlockProps> = ({
  scene,
  durationInFrames,
  isActive,
  onSeek,
}) => {
  const left = (scene.startFrame / durationInFrames) * 100;
  const width = ((scene.endFrame - scene.startFrame) / durationInFrames) * 100;

  return (
    <div
      className={`absolute top-0.5 bottom-0.5 rounded-md transition-all cursor-pointer ${
        isActive
          ? "ring-2 ring-white/50 brightness-110"
          : "hover:brightness-105"
      }`}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        minWidth: "40px",
        background: scene.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSeek?.(scene.startFrame);
      }}
      title={`${scene.name} (${scene.startFrame}-${scene.endFrame})`}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-1">
        <span className="text-[9px] font-medium text-white/90 truncate drop-shadow-sm">
          {scene.name}
        </span>
      </div>

      {/* Scene boundary indicators */}
      <div className="absolute left-0 top-0 h-full w-0.5 bg-white/20" />
      <div className="absolute right-0 top-0 h-full w-0.5 bg-white/20" />
    </div>
  );
};
