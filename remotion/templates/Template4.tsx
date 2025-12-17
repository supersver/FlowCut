import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Video,
  Audio,
} from "remotion";
import { IntroPresenter } from "./Template4/Components/IntroPresenter";
import { ContextLayer } from "./Template4/Components/ContextLayer";
import { PromiseText } from "./Template4/Components/PromiseText";
import { PhoneTease } from "./Template4/Components/PhoneTease";
import { WhatsAppCTA } from "./Template4/Components/WhatsAppCTA";
import { Outro } from "./Template4/Components/Outro";

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
}

interface Template4Props {
  recipientName: string;
  phoneName: string;
  presenterVideoUrl?: string;
  productImageUrl?: string;
  logoUrl?: string;
  customClips?: CustomClip[];
  musicUrl?: string;
  musicVolume?: number;
}

export const Template4: React.FC<Template4Props> = ({
  recipientName,
  phoneName,
  presenterVideoUrl,
  productImageUrl,
  logoUrl,
  customClips = [],
  musicUrl,
  musicVolume = 0.1, // Default low music volume to prioritize voice
}) => {
  const frame = useCurrentFrame();

  // Background Gradient Animation (Global)
  const gradientProgress = interpolate(frame, [0, 750], [0, 360]);

  // Global Presenter Video Logic
  // The presenter is visible in Scenes 1, 2, 3, 5, 6
  // Scene 4 (Phone Tease, 420-540) hides/dims the presenter
  const presenterOpacity =
    frame >= 420 && frame < 540
      ? interpolate(frame, [420, 435, 525, 540], [1, 0.0001, 0.0001, 1])
      : 1;

  // Intro Animation for Global Video (Scene 1: 0-90 frames)
  // Subtle fade-in
  const introOpacity = interpolate(frame, [0, 30], [0.0001, 1], {
    extrapolateRight: "clamp",
  });
  // Very slight push-in (2-3%)
  const introScale = interpolate(frame, [0, 90], [1, 1.03], {
    extrapolateRight: "clamp",
  });

  // Combined Opacity (Intro Fade AND Scene 4 Hide)
  const finalGlobalVideoOpacity = frame < 90 ? introOpacity : presenterOpacity;
  const finalGlobalVideoScale = frame < 90 ? introScale : 1;

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* Background Music */}
      {musicUrl && <Audio src={musicUrl} volume={musicVolume} loop />}

      {/* ============================================ */}
      {/* GLOBAL LAYERS */}
      {/* ============================================ */}

      {/* Logo on top-left */}
      {logoUrl && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            zIndex: 100,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                height: "40px",
                width: "auto",
                maxWidth: "120px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}

      {/* 1. Global Presenter Video Layer */}
      {/* This ensures the video plays continuously without cuts between scenes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          transform: `scale(${finalGlobalVideoScale})`,
          opacity: finalGlobalVideoOpacity,
        }}
      >
        {presenterVideoUrl ? (
          <Video
            src={presenterVideoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            // Audio enabled here globally - THIS IS THE MASTER AUDIO SOURCE
            volume={1}
          />
        ) : (
          /* Placeholder if no video provided */
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#1a1a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "#2a2a4e",
              }}
            />
          </div>
        )}
      </div>

      {/* 2. Global Gradient Overlay */}
      {/* Fades in after Intro, hides during Phone Tease */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${
            135 + gradientProgress * 0.1
          }deg, rgba(10, 10, 21, 0.6) 0%, rgba(26, 26, 46, 0.5) 50%, rgba(15, 15, 26, 0.7) 100%)`,
          zIndex: 1,
          opacity:
            frame < 90
              ? interpolate(frame, [60, 90], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : frame >= 420 && frame < 540
              ? 0
              : 1,
        }}
      />

      {/* 3. Subtle Animated Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(0, 100, 200, 0.1) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, rgba(0, 150, 255, 0.05) 0%, transparent 50%)`,
          opacity:
            frame < 90
              ? 0
              : interpolate(Math.sin(frame * 0.03), [-1, 1], [0.3, 0.6]),
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ============================================ */}
      {/* SCENES */}
      {/* ============================================ */}

      {/* Scene 1: Personal Recognition (0-90 frames) */}
      <Sequence from={0} durationInFrames={90} style={{ zIndex: 10 }}>
        {/* Helper handles TEXT ONLY now. Video handled globally above. */}
        <IntroPresenter recipientName={recipientName} />
      </Sequence>

      {/* Scene 2: Context Layer (90-210 frames) */}
      <Sequence from={90} durationInFrames={120} style={{ zIndex: 10 }}>
        <ContextLayer />
      </Sequence>

      {/* Scene 3: Single Core Promise (210-420 frames) */}
      <Sequence from={210} durationInFrames={210} style={{ zIndex: 10 }}>
        <PromiseText />
      </Sequence>

      {/* Scene 4: Soft Reveal + Tease (420-540 frames) */}
      <Sequence from={420} durationInFrames={120} style={{ zIndex: 10 }}>
        {/* Note: Presenter is hidden by global opacity logic during this time */}
        <PhoneTease phoneName={phoneName} productImageUrl={productImageUrl} />

        {/* Small PiP Presenter specific to this scene */}
        {/* {presenterVideoUrl && (
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              right: "50px",
              width: "250px",
              height: "350px",
              borderRadius: "20px",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.2)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              opacity: interpolate(frame - 420, [30, 50], [0, 0.9], {
                extrapolateRight: "clamp",
              }),
              zIndex: 20,
            }}
          >
            <Video
              src={presenterVideoUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.2)",
              }}
              muted={true} // Muted because master audio comes from the hidden global video layer
            />
          </div>
        )} */}
      </Sequence>

      {/* Scene 5: Reply-Based CTA (540-660 frames) */}
      <Sequence from={540} durationInFrames={120} style={{ zIndex: 10 }}>
        <WhatsAppCTA replyText="YES" />
      </Sequence>

      {/* Scene 6: Human Sign-Off (660-end frames) */}
      <Sequence from={660} durationInFrames={90} style={{ zIndex: 10 }}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
