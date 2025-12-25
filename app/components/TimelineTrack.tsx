"use client";

import React from "react";

interface TrackElement {
  id: string;
  startFrame: number;
  endFrame: number;
  label: string;
  color: string;
  icon?: string;
}

interface TimelineTrackProps {
  label: string;
  icon?: string;
  elements: TrackElement[];
  durationInFrames: number;
  currentFrame: number;
  height?: number;
  onElementClick?: (id: string, startFrame: number) => void;
  onAddClick?: () => void;
  addLabel?: string;
  showPlayhead?: boolean;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  label,
  icon,
  elements,
  durationInFrames,
  currentFrame,
  height = 28,
  onElementClick,
  onAddClick,
  addLabel,
  showPlayhead = true,
}) => {
  const playheadPosition = (currentFrame / durationInFrames) * 100;

  return (
    <div className="mb-1 relative">
      {/* Track Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-slate-500">
          {icon} {label} ({elements.length})
        </span>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="text-[9px] text-blue-400 hover:text-blue-300 cursor-pointer ml-auto"
          >
            + {addLabel || "Add"}
          </button>
        )}
      </div>

      {/* Track Body */}
      <div
        className="relative rounded-lg bg-slate-950/80 border border-slate-800 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Elements */}
        {elements.map((element) => {
          const left = (element.startFrame / durationInFrames) * 100;
          const width =
            ((element.endFrame - element.startFrame) / durationInFrames) * 100;
          const isActive =
            currentFrame >= element.startFrame &&
            currentFrame < element.endFrame;

          return (
            <div
              key={element.id}
              className={`absolute top-0.5 bottom-0.5 rounded-md transition-all cursor-pointer ${
                isActive
                  ? "ring-1 ring-white/50 brightness-110"
                  : "hover:brightness-105"
              }`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: "30px",
                background: element.color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onElementClick?.(element.id, element.startFrame);
              }}
              title={`${element.label} (${element.startFrame}-${element.endFrame})`}
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-1">
                {element.icon && (
                  <span className="text-[8px] mr-0.5">{element.icon}</span>
                )}
                <span className="text-[8px] font-medium text-white/90 truncate">
                  {element.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Playhead */}
        {showPlayhead && (
          <div
            className="absolute top-0 h-full w-0.5 bg-blue-400/70 pointer-events-none z-10"
            style={{ left: `${playheadPosition}%` }}
          />
        )}

        {/* Empty state message */}
        {elements.length === 0 && onAddClick && (
          <button
            onClick={onAddClick}
            className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-slate-800/30 transition"
          >
            <span className="text-[10px] text-slate-500">
              + Click to add {label.toLowerCase()}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
