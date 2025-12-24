import React from "react";
import { Player, PlayerRef } from "@remotion/player";
import { AspectRatio, TemplateConfig } from "@/app/types";

interface VideoPreviewProps {
  playerRef: React.RefObject<PlayerRef>;
  playerContainerRef: React.RefObject<HTMLDivElement>;
  isMounted: boolean;
  selectedTemplate: TemplateConfig;
  aspectRatio: AspectRatio;
  fps: number;
  inputProps: Record<string, unknown>;
}

export function VideoPreview({
  playerRef,
  playerContainerRef,
  isMounted,
  selectedTemplate,
  aspectRatio,
  fps,
  inputProps,
}: VideoPreviewProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 min-w-0">
      <div
        ref={playerContainerRef}
        className="relative rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl"
        style={{
          width:
            aspectRatio.id === "16:9"
              ? "100%"
              : aspectRatio.id === "1:1"
              ? "min(100%, 400px)"
              : "min(100%, 320px)",
          maxWidth: "100%",
          aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
        }}
      >
        {isMounted ? (
          <Player
            ref={playerRef}
            component={
              selectedTemplate.component as unknown as React.FC<
                Record<string, unknown>
              >
            }
            durationInFrames={selectedTemplate.duration}
            compositionWidth={aspectRatio.width}
            compositionHeight={aspectRatio.height}
            acknowledgeRemotionLicense
            fps={fps}
            inputProps={inputProps}
            style={{ width: "100%", height: "100%" }}
            controls
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            Loading...
          </div>
        )}
      </div>
    </main>
  );
}
