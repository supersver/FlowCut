import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  OffthreadVideo,
  Audio,
  staticFile,
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

interface CaptionItem {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
}

interface CaptionSettings {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: "top" | "center" | "bottom";
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
  captions?: CaptionItem[];
  captionSettings?: CaptionSettings;
  usePhoneTease?: boolean;
}

export const Template4: React.FC<Template4Props> = ({
  recipientName,
  phoneName,
  presenterVideoUrl,
  productImageUrl,
  logoUrl,
  customClips = [],
  musicUrl,
  musicVolume = 0.1,
  captions: captionsProp,
  captionSettings: captionSettingsProp,
  usePhoneTease = true,
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

  // ============================================
  // CAPTIONS LOGIC
  // ============================================
  // Default captions (fallback if none provided via props)
  const defaultCaptions = [
    {
      id: "1",
      startFrame: 3,
      endFrame: 75,
      text: "Hey Mayank, quick heads up before we go",
    },
    {
      id: "2",
      startFrame: 75,
      endFrame: 130,
      text: "live. You're probably on your phone",
    },
    {
      id: "3",
      startFrame: 130,
      endFrame: 202,
      text: "most of the day. Work calls, messages, a",
    },
    {
      id: "4",
      startFrame: 202,
      endFrame: 283,
      text: "bunch of apps open. Your day is heavy. So",
    },
    {
      id: "5",
      startFrame: 283,
      endFrame: 355,
      text: "we're working on something to fix that. A",
    },
    {
      id: "6",
      startFrame: 355,
      endFrame: 410,
      text: "phone that just keeps going without",
    },
    {
      id: "7",
      startFrame: 410,
      endFrame: 491,
      text: "you having to slow down. A new Vivo X300",
    },
    {
      id: "8",
      startFrame: 491,
      endFrame: 563,
      text: "doesn't just keep up, it leads. Want to",
    },
    {
      id: "9",
      startFrame: 563,
      endFrame: 636,
      text: "see it first? Just respond with yes to",
    },
    { id: "10", startFrame: 636, endFrame: 654, text: "this message." },
  ];

  // Use props captions if provided, otherwise use defaults
  const captions =
    captionsProp && captionsProp.length > 0 ? captionsProp : defaultCaptions;

  // Caption settings with defaults
  const captionSettings: CaptionSettings = {
    fontFamily: captionSettingsProp?.fontFamily || "Inter",
    fontSize: captionSettingsProp?.fontSize || 44,
    color: captionSettingsProp?.color || "#ffffff",
    backgroundColor:
      captionSettingsProp?.backgroundColor || "rgba(0, 0, 0, 0.7)",
    position: captionSettingsProp?.position || "bottom",
  };

  // Get caption position in pixels
  const getCaptionPosition = () => {
    // Adjust position based on scene context
    const isIntroOrPromise = frame < 90 || (frame >= 210 && frame < 420);

    switch (captionSettings.position) {
      case "top":
        return "100px";
      case "center":
        return "50%";
      case "bottom":
      default:
        return isIntroOrPromise ? "310px" : "100px";
    }
  };

  // Get current caption based on frame
  const currentCaption = captions.find(
    (cap) => frame >= cap.startFrame && frame < cap.endFrame
  );

  // Caption fade animation
  const getCaptionOpacity = () => {
    if (!currentCaption) return 0;
    const fadeInEnd = currentCaption.startFrame + 5;
    const fadeOutStart = currentCaption.endFrame - 5;

    if (frame < fadeInEnd) {
      return interpolate(
        frame,
        [currentCaption.startFrame, fadeInEnd],
        [0, 1],
        {
          extrapolateRight: "clamp",
        }
      );
    }
    if (frame > fadeOutStart) {
      return interpolate(
        frame,
        [fadeOutStart, currentCaption.endFrame],
        [1, 0],
        {
          extrapolateRight: "clamp",
        }
      );
    }
    return 1;
  };

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
                height: "50px",
                width: "auto",
                maxWidth: "150px",
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
          <OffthreadVideo
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

        {usePhoneTease ? (
          /* PhoneTease animation */
          <PhoneTease phoneName={phoneName} productImageUrl={productImageUrl} />
        ) : (
          /* Fullscreen product image with soft reveal */
          (() => {
            // Scene starts at frame 420, so we use relative frame for animation
            const sceneFrame = frame - 420;

            // Fade in over first 20 frames
            const opacity = interpolate(sceneFrame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            });

            // Subtle scale animation (start slightly zoomed, ease to normal)
            const scale = interpolate(sceneFrame, [0, 60], [1.05, 1], {
              extrapolateRight: "clamp",
            });

            // Subtle vertical drift (start slightly lower, rise up)
            const translateY = interpolate(sceneFrame, [0, 40], [20, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <AbsoluteFill
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#0a0a15",
                  opacity,
                }}
              >
                <img
                  src={productImageUrl || staticFile("product-image.jpg")}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                  }}
                />
              </AbsoluteFill>
            );
          })()
        )}

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
      <Sequence from={540} durationInFrames={110} style={{ zIndex: 10 }}>
        <WhatsAppCTA replyText="YES" />
      </Sequence>

      {/* Scene 6: Human Sign-Off (660-end frames) */}
      {/* <Sequence from={660} durationInFrames={90} style={{ zIndex: 10 }}>
        <Outro />
      </Sequence> */}

      {/* ============================================ */}
      {/* CAPTIONS OVERLAY */}
      {/* ============================================ */}
      {currentCaption && (
        <div
          style={{
            position: "absolute",
            // Use dynamic position from settings
            bottom:
              captionSettings.position === "top"
                ? undefined
                : getCaptionPosition(),
            top:
              captionSettings.position === "top"
                ? "100px"
                : captionSettings.position === "center"
                ? "50%"
                : undefined,
            left: "50%",
            transform:
              captionSettings.position === "center"
                ? "translate(-50%, -50%)"
                : "translateX(-50%)",
            zIndex: 200,
            opacity: getCaptionOpacity(),
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: captionSettings.backgroundColor,
              padding: "16px 32px",
              borderRadius: "12px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                color: captionSettings.color,
                fontSize: `${captionSettings.fontSize}px`,
                fontWeight: 600,
                fontFamily: `'${captionSettings.fontFamily}', 'Segoe UI', sans-serif`,
                lineHeight: 1.4,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {currentCaption.text}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
