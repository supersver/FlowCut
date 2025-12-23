"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
  layer: number;
}

interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

// Scene definition for timeline visualization
interface SceneDefinition {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  color: string;
}

interface TimelineProps {
  currentFrame: number;
  durationInFrames: number;
  fps: number;
  customClips: CustomClip[];
  onSeek: (frame: number) => void;
  onClipUpdate: (id: string, startFrame: number, endFrame: number) => void;
  onClipLayerUpdate?: (id: string, layer: number) => void;
  onClipRemove?: (id: string) => void;
  // Scene props
  scenes?: SceneDefinition[];
  // Music props (array of tracks)
  musicTracks?: MusicTrack[];
  onMusicUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMusicTrackUpdate?: (
    id: string,
    updates: Partial<Omit<MusicTrack, "id" | "url">>
  ) => void;
  onMusicTrackRemove?: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentFrame,
  durationInFrames,
  fps,
  customClips,
  onSeek,
  onClipUpdate,
  onClipLayerUpdate,
  onClipRemove,
  scenes = [],
  musicTracks = [],
  onMusicUpload,
  onMusicTrackUpdate,
  onMusicTrackRemove,
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
  const [draggingMusic, setDraggingMusic] = useState<{
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
      console.log("Timeline clicked!", {
        draggingClip,
        timelineRef: timelineRef.current,
      });
      if (draggingClip) return;

      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const frame = Math.round(percentage * durationInFrames);
      console.log("Seeking to frame:", frame);
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

  // Music drag handling
  const handleMusicMouseDown = useCallback(
    (
      e: React.MouseEvent,
      track: MusicTrack,
      type: "move" | "resize-start" | "resize-end"
    ) => {
      e.stopPropagation();
      setDraggingMusic({
        id: track.id,
        type,
        startX: e.clientX,
        originalStart: track.startFrame,
        originalEnd: track.endFrame,
      });
    },
    []
  );

  useEffect(() => {
    if (!draggingMusic || !onMusicTrackUpdate) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = timelineRef.current?.getBoundingClientRect();
      if (!rect || !draggingMusic) return;

      const deltaX = e.clientX - draggingMusic.startX;
      const deltaFrames = Math.round((deltaX / rect.width) * durationInFrames);

      let newStart = draggingMusic.originalStart;
      let newEnd = draggingMusic.originalEnd;

      if (draggingMusic.type === "move") {
        const clipDuration =
          draggingMusic.originalEnd - draggingMusic.originalStart;
        newStart = Math.max(0, draggingMusic.originalStart + deltaFrames);
        newEnd = newStart + clipDuration;

        if (newEnd > durationInFrames) {
          newEnd = durationInFrames;
          newStart = newEnd - clipDuration;
        }
      } else if (draggingMusic.type === "resize-start") {
        newStart = Math.max(
          0,
          Math.min(
            draggingMusic.originalEnd - fps,
            draggingMusic.originalStart + deltaFrames
          )
        );
      } else if (draggingMusic.type === "resize-end") {
        newEnd = Math.max(
          draggingMusic.originalStart + fps,
          Math.min(durationInFrames, draggingMusic.originalEnd + deltaFrames)
        );
      }

      onMusicTrackUpdate(draggingMusic.id, {
        startFrame: newStart,
        endFrame: newEnd,
      });
    };

    const handleMouseUp = () => {
      setDraggingMusic(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingMusic, durationInFrames, fps, onMusicTrackUpdate]);

  return (
    <div className="rounded-2xl relative border border-slate-800 bg-slate-900/70 p-4">
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
      <div className="mb-2 relative flex h-6 items-end justify-between border-b border-slate-800 pb-1">
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

      {/* Scene Track - Shows template scenes */}
      {scenes.length > 0 && (
        <div className="mb-1 relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-slate-500">
              🎬 Scenes ({scenes.length})
            </span>
          </div>
          <div
            className="relative rounded-lg bg-slate-950/80 border border-slate-800 overflow-hidden"
            style={{ height: "28px" }}
          >
            {scenes.map((scene) => {
              const left = (scene.startFrame / durationInFrames) * 100;
              const width =
                ((scene.endFrame - scene.startFrame) / durationInFrames) * 100;
              const isActive =
                currentFrame >= scene.startFrame &&
                currentFrame < scene.endFrame;

              return (
                <div
                  key={scene.id}
                  className={`absolute top-0.5 bottom-0.5 rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "ring-1 ring-white/50 brightness-110"
                      : "hover:brightness-105"
                  }`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    minWidth: "30px",
                    background: scene.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(scene.startFrame);
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
            })}

            {/* Playhead on scene track */}
            <div
              className="absolute top-0 h-full w-0.5 bg-blue-400/70 pointer-events-none z-10"
              style={{ left: `${playheadPosition}%` }}
            />
          </div>
        </div>
      )}

      {/* Music Tracks - Above Main Timeline */}
      <div className="mb-1 relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-slate-500">
            🎵 Audio ({musicTracks.length})
          </span>
          <label className="text-[9px] text-blue-400 hover:text-blue-300 cursor-pointer ml-auto">
            <input
              type="file"
              accept="audio/*"
              onChange={onMusicUpload}
              className="hidden"
            />
            + Add Music
          </label>
        </div>
        <div
          className="relative rounded-lg bg-slate-950/80 border border-slate-800 overflow-hidden"
          style={{
            minHeight:
              musicTracks.length > 0
                ? `${musicTracks.length * 28 + 8}px`
                : "32px",
          }}
        >
          {musicTracks.length === 0 ? (
            <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-slate-800/30 transition">
              <input
                type="file"
                accept="audio/*"
                onChange={onMusicUpload}
                className="hidden"
              />
              <span className="text-[10px] text-slate-500">
                + Click to add music
              </span>
            </label>
          ) : (
            <>
              {/* Render each music track */}
              {musicTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="absolute left-0 right-0"
                  style={{ top: `${4 + index * 28}px`, height: "24px" }}
                >
                  {/* Track bar */}
                  <div
                    className={`absolute top-0 bottom-0 rounded-md bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all ${
                      draggingMusic?.id === track.id
                        ? "ring-2 ring-white/50"
                        : ""
                    }`}
                    style={{
                      left: `${(track.startFrame / durationInFrames) * 100}%`,
                      width: `${
                        ((track.endFrame - track.startFrame) /
                          durationInFrames) *
                        100
                      }%`,
                      minWidth: "60px",
                    }}
                  >
                    {/* Waveform bars */}
                    <div className="absolute inset-0 flex items-center justify-around px-1 overflow-hidden">
                      {Array.from({ length: 20 }).map((_, i) => {
                        const height = 30 + Math.sin(i * 0.8 + index) * 25 + 10;
                        return (
                          <div
                            key={i}
                            className="w-0.5 rounded-full bg-white/30"
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>

                    {/* Resize Handle - Start */}
                    <div
                      className="absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-white/30 hover:bg-white/50 transition rounded-l-md"
                      onMouseDown={(e) =>
                        handleMusicMouseDown(e, track, "resize-start")
                      }
                    />

                    {/* Move Handle - Middle with controls */}
                    <div
                      className="absolute inset-x-2 inset-y-0 cursor-grab flex items-center justify-between px-1"
                      onMouseDown={(e) =>
                        handleMusicMouseDown(e, track, "move")
                      }
                    >
                      <span className="text-[9px] font-medium text-white/80">
                        🎵
                      </span>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={track.volume}
                          onChange={(e) =>
                            onMusicTrackUpdate?.(track.id, {
                              volume: parseFloat(e.target.value),
                            })
                          }
                          className="w-10 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMusicTrackRemove?.(track.id);
                          }}
                          className="text-[8px] text-red-300 hover:text-red-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Resize Handle - End */}
                    <div
                      className="absolute right-0 top-0 h-full w-2 cursor-ew-resize bg-white/30 hover:bg-white/50 transition rounded-r-md"
                      onMouseDown={(e) =>
                        handleMusicMouseDown(e, track, "resize-end")
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Playhead on music track */}
              <div
                className="absolute top-0 h-full w-0.5 bg-blue-400/70 pointer-events-none z-10"
                style={{ left: `${playheadPosition}%` }}
              />
            </>
          )}
        </div>
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
                  ? clip.layer === 0
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30"
                    : "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
                  : clip.layer === 0
                  ? "bg-gradient-to-r from-amber-500/60 to-orange-600/60"
                  : "bg-gradient-to-r from-violet-500/60 to-purple-600/60"
              } ${draggingClip?.id === clip.id ? "ring-2 ring-white/50" : ""}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: "80px",
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
                className="absolute inset-x-2 inset-y-0 cursor-grab flex items-center justify-between px-1"
                onMouseDown={(e) => handleClipMouseDown(e, clip, "move")}
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium text-white/90">
                    {clip.type === "video" ? "🎥" : "🖼️"}
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-white/20 text-white/80">
                    {clip.layer === 0 ? "BG" : "OV"}
                  </span>
                  <span className="text-[9px] text-white/70">
                    {((clip.endFrame - clip.startFrame) / fps).toFixed(1)}s
                  </span>
                </div>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Layer toggle */}
                  {onClipLayerUpdate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClipLayerUpdate(clip.id, clip.layer === 0 ? 1 : 0);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/40 text-white/80"
                      title={
                        clip.layer === 0
                          ? "Move to overlay"
                          : "Move to background"
                      }
                    >
                      {clip.layer === 0 ? "↑" : "↓"}
                    </button>
                  )}
                  {/* Remove button */}
                  {onClipRemove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClipRemove(clip.id);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-[8px] text-red-300 hover:text-red-200"
                    >
                      ✕
                    </button>
                  )}
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
      {customClips.length === 0 && musicTracks.length === 0 && (
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Add custom clips above to see them on the timeline. Click anywhere to
          seek.
        </p>
      )}
      {(customClips.length > 0 || musicTracks.length > 0) && (
        <p className="mt-2 text-center text-[11px] text-slate-500">
          Drag clips to move • Drag edges to resize • Click to seek
        </p>
      )}
    </div>
  );
};
