import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  OffthreadVideo,
  Audio,
  Img,
  staticFile,
} from "remotion";
import { IntroPresenter } from "./Template1/Components/IntroPresenter";
import { ContextLayer } from "./Template1/Components/ContextLayer";
import { PromiseText } from "./Template1/Components/PromiseText";
import { PhoneTease } from "./Template1/Components/PhoneTease";
import { WhatsAppCTA } from "./Template1/Components/WhatsAppCTA";
import { Outro } from "./Template1/Components/Outro";
import {
  SCENE_COMPONENT_REGISTRY,
  DEFAULT_SCENE_ELEMENT_MAP,
} from "./SceneRegistry";

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
  layer: number; // 0 = background, 1+ = overlay
}

interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
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

interface SceneTiming {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  color: string;
  elementId?: string; // Links to SCENE_ELEMENTS.id for dynamic rendering
}

interface Template1Props {
  recipientName: string;
  phoneName: string;
  presenterVideoUrl?: string;
  productImageUrl?: string;
  logoUrl?: string;
  customClips?: CustomClip[];
  musicTracks?: MusicTrack[];
  captions?: CaptionItem[];
  captionSettings?: CaptionSettings;
  usePhoneTease?: boolean;
  sceneTimings?: SceneTiming[];
}

export const Template1: React.FC<Template1Props> = ({
  recipientName,
  phoneName,
  presenterVideoUrl,
  productImageUrl,
  logoUrl,
  customClips = [],
  musicTracks = [],
  captions: captionsProp,
  captionSettings: captionSettingsProp,
  usePhoneTease = true,
  sceneTimings,
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
  // Captions are only shown when an SRT file is uploaded (no hardcoded defaults)
  const captions = captionsProp && captionsProp.length > 0 ? captionsProp : [];

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

  // Default scene timings (used when sceneTimings prop is not provided)
  const defaultSceneTimings = {
    intro: { startFrame: 0, endFrame: 90 },
    context: { startFrame: 90, endFrame: 210 },
    promise: { startFrame: 210, endFrame: 420 },
    reveal: { startFrame: 420, endFrame: 540 },
    cta: { startFrame: 540, endFrame: 650 },
    outro: { startFrame: 650, endFrame: 750 },
  };

  // Helper to get scene timing - uses prop values if available, otherwise defaults
  const getSceneTiming = (sceneName: string) => {
    const sceneIds: Record<string, string> = {
      intro: "t1-s1",
      context: "t1-s2",
      promise: "t1-s3",
      reveal: "t1-s4",
      cta: "t1-s5",
      outro: "t1-s6",
    };

    const sceneId = sceneIds[sceneName];
    const sceneTiming = sceneTimings?.find((s) => s.id === sceneId);

    if (sceneTiming) {
      return {
        from: sceneTiming.startFrame,
        duration: sceneTiming.endFrame - sceneTiming.startFrame,
      };
    }

    const defaults =
      defaultSceneTimings[sceneName as keyof typeof defaultSceneTimings];
    return {
      from: defaults?.startFrame || 0,
      duration: (defaults?.endFrame || 90) - (defaults?.startFrame || 0),
    };
  };

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* Background Music Tracks - with proper timing */}
      {musicTracks.map((track) => (
        <Sequence
          key={track.id}
          from={track.startFrame}
          durationInFrames={track.endFrame - track.startFrame}
        >
          <Audio src={track.url} volume={track.volume} />
        </Sequence>
      ))}

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

      {/* Scene 1: Personal Recognition */}
      <Sequence
        from={getSceneTiming("intro").from}
        durationInFrames={getSceneTiming("intro").duration}
        style={{ zIndex: 10 }}
      >
        {/* Helper handles TEXT ONLY now. Video handled globally above. */}
        <IntroPresenter recipientName={recipientName} />
      </Sequence>

      {/* Scene 2: Context Layer */}
      <Sequence
        from={getSceneTiming("context").from}
        durationInFrames={getSceneTiming("context").duration}
        style={{ zIndex: 10 }}
      >
        <ContextLayer />
      </Sequence>

      {/* Scene 3: Single Core Promise */}
      <Sequence
        from={getSceneTiming("promise").from}
        durationInFrames={getSceneTiming("promise").duration}
        style={{ zIndex: 10 }}
      >
        <PromiseText />
      </Sequence>

      {/* Scene 4: Soft Reveal + Tease */}
      <Sequence
        from={getSceneTiming("reveal").from}
        durationInFrames={getSceneTiming("reveal").duration}
        style={{ zIndex: 10 }}
      >
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

      {/* Scene 5: Reply-Based CTA */}
      <Sequence
        from={getSceneTiming("cta").from}
        durationInFrames={getSceneTiming("cta").duration}
        style={{ zIndex: 10 }}
      >
        <WhatsAppCTA replyText="YES" />
      </Sequence>

      {/* Scene 6: Human Sign-Off (660-end frames) */}
      {/* <Sequence from={660} durationInFrames={90} style={{ zIndex: 10 }}>
        <Outro />
      </Sequence> */}

      {/* ============================================ */}
      {/* DYNAMIC SCENES - Rendered from sceneTimings array */}
      {/* ============================================ */}
      {sceneTimings
        ?.filter((scene) => {
          // Only render scenes that have an elementId AND are not default scenes
          const isDefaultScene = Object.keys(
            DEFAULT_SCENE_ELEMENT_MAP
          ).includes(scene.id);
          return scene.elementId && !isDefaultScene;
        })
        .map((scene) => {
          const Component = scene.elementId
            ? SCENE_COMPONENT_REGISTRY[scene.elementId]
            : null;
          if (!Component) return null;

          return (
            <Sequence
              key={scene.id}
              from={scene.startFrame}
              durationInFrames={scene.endFrame - scene.startFrame}
              style={{ zIndex: 15 }}
            >
              <Component
                recipientName={recipientName}
                phoneName={phoneName}
                productImageUrl={productImageUrl}
              />
            </Sequence>
          );
        })}

      {/* ============================================ */}
      {/* CUSTOM CLIPS - Integrated into video composition */}
      {/* ============================================ */}

      {/* Background clips (layer 0) - render below scenes */}
      {customClips
        .filter((clip) => clip.layer === 0)
        .map((clip) => (
          <Sequence
            key={clip.id}
            from={clip.startFrame}
            durationInFrames={clip.endFrame - clip.startFrame}
            style={{ zIndex: 5 }}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
              }}
            >
              {clip.type === "video" ? (
                <OffthreadVideo
                  src={clip.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Img
                  src={clip.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </AbsoluteFill>
          </Sequence>
        ))}

      {/* Overlay clips (layer 1+) - render above scenes */}
      {customClips
        .filter((clip) => clip.layer >= 1)
        .map((clip) => (
          <Sequence
            key={clip.id}
            from={clip.startFrame}
            durationInFrames={clip.endFrame - clip.startFrame}
            style={{ zIndex: 50 + clip.layer }}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {clip.type === "video" ? (
                <OffthreadVideo
                  src={clip.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Img
                  src={clip.url}
                  style={{
                    maxWidth: "80%",
                    maxHeight: "80%",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  }}
                />
              )}
            </AbsoluteFill>
          </Sequence>
        ))}
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
