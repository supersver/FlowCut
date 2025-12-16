"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
}

interface TimelineProps {
  currentFrame: number;
  durationInFrames: number;
  fps: number;
  customClips: CustomClip[];
  onSeek: (frame: number) => void;
  onClipUpdate: (id: string, startFrame: number, endFrame: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentFrame,
  durationInFrames,
  fps,
  customClips,
  onSeek,
  onClipUpdate,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingClip, setDraggingClip] = useState<{
    id: string;
    type: "move" | "resize-start" | "resize-end";
    startX: number;
    originalStart: number;
    originalEnd: number;
  } | null>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);

  const totalDuration = durationInFrames / fps;
  const playheadPosition = (currentFrame / durationInFrames) * 100;

  // Generate time markers
  const markers: { time: number; label: string }[] = [];
  const interval = totalDuration <= 10 ? 1 : totalDuration <= 30 ? 5 : 10;
  for (let t = 0; t <= totalDuration; t += interval) {
    markers.push({
      time: t,
      label: `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(
        2,
        "0"
      )}`,
    });
  }

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      if (draggingClip) return;

      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const frame = Math.round(percentage * durationInFrames);
      onSeek(frame);
    },
    [durationInFrames, onSeek, draggingClip]
  );

  const handleTimelineMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const time = percentage * totalDuration;
      setHoveredTime(time);
    },
    [totalDuration]
  );

  const handleClipMouseDown = useCallback(
    (
      e: React.MouseEvent,
      clip: CustomClip,
      type: "move" | "resize-start" | "resize-end"
    ) => {
      e.stopPropagation();
      setDraggingClip({
        id: clip.id,
        type,
        startX: e.clientX,
        originalStart: clip.startFrame,
        originalEnd: clip.endFrame,
      });
    },
    []
  );

  useEffect(() => {
    if (!draggingClip) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect || !draggingClip) return;

      const deltaX = e.clientX - draggingClip.startX;
      const deltaFrames = Math.round((deltaX / rect.width) * durationInFrames);

      let newStart = draggingClip.originalStart;
      let newEnd = draggingClip.originalEnd;

      if (draggingClip.type === "move") {
        const clipDuration =
          draggingClip.originalEnd - draggingClip.originalStart;
        newStart = Math.max(0, draggingClip.originalStart + deltaFrames);
        newEnd = newStart + clipDuration;

        // Prevent going past end
        if (newEnd > durationInFrames) {
          newEnd = durationInFrames;
          newStart = newEnd - clipDuration;
        }
      } else if (draggingClip.type === "resize-start") {
        newStart = Math.max(
          0,
          Math.min(
            draggingClip.originalEnd - fps,
            draggingClip.originalStart + deltaFrames
          )
        );
      } else if (draggingClip.type === "resize-end") {
        newEnd = Math.max(
          draggingClip.originalStart + fps,
          Math.min(durationInFrames, draggingClip.originalEnd + deltaFrames)
        );
      }

      onClipUpdate(draggingClip.id, newStart, newEnd);
    };

    const handleMouseUp = () => {
      setDraggingClip(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingClip, durationInFrames, fps, onClipUpdate]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-100">Timeline</h3>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>
            {Math.floor(currentFrame / fps / 60)}:
            {String(Math.floor((currentFrame / fps) % 60)).padStart(2, "0")}.
            {String(Math.floor(((currentFrame / fps) % 1) * 100)).padStart(
              2,
              "0"
            )}
          </span>
          <span className="text-slate-600">|</span>
          <span>{totalDuration.toFixed(1)}s total</span>
        </div>
      </div>

      {/* Time Ruler */}
      <div className="mb-2 flex h-6 items-end justify-between border-b border-slate-800 pb-1">
        {markers.map((marker, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center"
            style={{
              position: "absolute",
              left: `${(marker.time / totalDuration) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-[10px] text-slate-500">{marker.label}</span>
            <div className="h-2 w-px bg-slate-700" />
          </div>
        ))}
      </div>

      {/* Main Timeline Track */}
      <div
        ref={timelineRef}
        className="relative h-16 cursor-pointer rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineMouseMove}
        onMouseLeave={() => setHoveredTime(null)}
      >
        {/* Background grid */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-slate-700"
              style={{ left: `${((i + 1) / totalDuration) * 100}%` }}
            />
          ))}
        </div>

        {/* Custom Clips */}
        {customClips.map((clip) => {
          const left = (clip.startFrame / durationInFrames) * 100;
          const width =
            ((clip.endFrame - clip.startFrame) / durationInFrames) * 100;
          const isActive =
            currentFrame >= clip.startFrame && currentFrame < clip.endFrame;

          return (
            <div
              key={clip.id}
              className={`absolute top-2 h-12 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
                  : "bg-gradient-to-r from-violet-500/60 to-purple-600/60"
              } ${draggingClip?.id === clip.id ? "ring-2 ring-white/50" : ""}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: "40px",
              }}
            >
              {/* Resize Handle - Start */}
              <div
                className="absolute left-0 top-0 h-full w-2 cursor-ew-resize rounded-l-lg bg-white/20 hover:bg-white/40 transition"
                onMouseDown={(e) =>
                  handleClipMouseDown(e, clip, "resize-start")
                }
              />

              {/* Move Handle - Middle */}
              <div
                className="absolute inset-x-2 inset-y-0 cursor-grab flex items-center justify-center"
                onMouseDown={(e) => handleClipMouseDown(e, clip, "move")}
              >
                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-[10px] font-medium text-white/90 truncate">
                    {clip.type === "video" ? "🎥" : "🖼️"}
                  </span>
                  <span className="text-[10px] font-medium text-white/80 truncate">
                    {((clip.endFrame - clip.startFrame) / fps).toFixed(1)}s
                  </span>
                </div>
              </div>

              {/* Resize Handle - End */}
              <div
                className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r-lg bg-white/20 hover:bg-white/40 transition"
                onMouseDown={(e) => handleClipMouseDown(e, clip, "resize-end")}
              />
            </div>
          );
        })}

        {/* Hover time indicator */}
        {hoveredTime !== null && !draggingClip && (
          <div
            className="absolute top-0 h-full w-px bg-slate-400/50 pointer-events-none"
            style={{ left: `${(hoveredTime / totalDuration) * 100}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap">
              {Math.floor(hoveredTime / 60)}:
              {String(Math.floor(hoveredTime % 60)).padStart(2, "0")}
            </div>
          </div>
        )}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-500 shadow-lg shadow-blue-500/50 z-10 pointer-events-none"
          style={{ left: `${playheadPosition}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-500" />
        </div>
      </div>

      {/* Instructions */}
      {customClips.length === 0 && (
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Add custom clips above to see them on the timeline. Click anywhere to
          seek.
        </p>
      )}
      {customClips.length > 0 && (
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Drag clips to move • Drag edges to resize • Click to seek
        </p>
      )}
    </div>
  );
};
