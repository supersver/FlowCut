import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Img,
  Video,
  spring,
  useVideoConfig,
} from "remotion";

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
  presenterImageUrl?: string;
  customClips?: CustomClip[];
}

// ============================================
// Reusable Components
// ============================================

// Placeholder Presenter Component
const PresenterPlaceholder: React.FC<{
  imageUrl?: string;
  opacity?: number;
  scale?: number;
}> = ({ imageUrl, opacity = 1, scale = 1 }) => {
  const frame = useCurrentFrame();

  // Subtle breathing animation
  const breathe = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.98, 1.02]);

  if (imageUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: `scale(${scale * breathe})`,
        }}
      >
        <Img
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
      </div>
    );
  }

  // Fallback placeholder silhouette
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale * breathe})`,
      }}
    >
      <div
        style={{
          width: "300px",
          height: "400px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          borderRadius: "150px 150px 100px 100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "40px",
        }}
      >
        {/* Head */}
        <div
          style={{
            width: "120px",
            height: "140px",
            borderRadius: "50%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
            marginBottom: "20px",
          }}
        />
        {/* Shoulders */}
        <div
          style={{
            width: "200px",
            height: "120px",
            borderRadius: "100px 100px 0 0",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        />
      </div>
    </div>
  );
};

// Context Layer with floating icons
const ContextLayer: React.FC<{ persona: string }> = ({ persona }) => {
  const frame = useCurrentFrame();

  const icons = [
    { emoji: "📱", x: 15, y: 20, delay: 0 },
    { emoji: "💬", x: 80, y: 35, delay: 10 },
    { emoji: "📅", x: 25, y: 70, delay: 20 },
    { emoji: "📧", x: 75, y: 65, delay: 15 },
    { emoji: "🔔", x: 10, y: 45, delay: 25 },
    { emoji: "⚡", x: 85, y: 50, delay: 5 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {icons.map((icon, idx) => {
        const iconFrame = Math.max(0, frame - 90 - icon.delay);
        const opacity = interpolate(iconFrame, [0, 30], [0, 0.6], {
          extrapolateRight: "clamp",
        });
        const driftX = Math.sin((frame + icon.delay) * 0.02) * 15;
        const driftY = Math.cos((frame + icon.delay) * 0.015) * 10;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              fontSize: "48px",
              opacity,
              transform: `translate(${driftX}px, ${driftY}px)`,
              filter: "blur(1px)",
            }}
          >
            {icon.emoji}
          </div>
        );
      })}
    </div>
  );
};

// Phone Tease Component - Vivo Style
const PhoneTease: React.FC<{
  phoneName: string;
  opacity: number;
  rotation: number;
}> = ({ phoneName, opacity, rotation }) => {
  const frame = useCurrentFrame();

  // Light sweep animation
  const sweepPosition = interpolate((frame - 420) % 120, [0, 120], [-50, 150]);

  // Soft glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.6]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Phone silhouette */}
      <div
        style={{
          position: "relative",
          width: "280px",
          height: "580px",
          borderRadius: "48px",
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
          border: "4px solid rgba(255,255,255,0.15)",
          boxShadow: `0 0 60px rgba(0, 150, 255, ${glowIntensity}), 0 30px 60px rgba(0,0,0,0.5)`,
          overflow: "hidden",
        }}
      >
        {/* Camera module - Vivo style */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)",
            border: "2px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Main camera lens */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #1e3a5f 0%, #0a1929 70%)",
              border: "3px solid rgba(0, 150, 255, 0.5)",
              boxShadow: "inset 0 0 10px rgba(0, 150, 255, 0.3)",
            }}
          />
        </div>

        {/* Screen area */}
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "15px",
            right: "15px",
            bottom: "30px",
            borderRadius: "30px",
            background: "linear-gradient(180deg, #0a0a15 0%, #12121f 100%)",
            overflow: "hidden",
          }}
        >
          {/* Screen glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at center, rgba(0, 150, 255, ${
                glowIntensity * 0.3
              }) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Edge highlight sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${sweepPosition}%`,
            width: "30px",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transform: "skewX(-20deg)",
          }}
        />
      </div>

      {/* Phone name text */}
      <p
        style={{
          marginTop: "30px",
          fontSize: "32px",
          fontWeight: "500",
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        {phoneName}
      </p>
    </div>
  );
};

// WhatsApp CTA Component
const WhatsAppCTA: React.FC<{ replyText: string; opacity: number }> = ({
  replyText,
  opacity,
}) => {
  const frame = useCurrentFrame();

  // Pulse animation for reply field
  const pulseScale = interpolate(
    Math.sin((frame - 540) * 0.1),
    [-1, 1],
    [1, 1.02]
  );

  // Cursor blink
  const cursorOpacity = Math.floor((frame - 540) / 15) % 2 === 0 ? 1 : 0;

  // Typing animation for "Type a message"
  const typingFrame = Math.max(0, frame - 560);
  const fullText = "Type a message";
  const visibleChars = Math.min(Math.floor(typingFrame / 3), fullText.length);
  const displayText = fullText.substring(0, visibleChars);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        opacity,
        padding: "0 40px",
      }}
    >
      {/* Message bubble */}
      <div
        style={{
          background: "#DCF8C6",
          borderRadius: "20px 20px 20px 5px",
          padding: "20px 28px",
          marginBottom: "20px",
          maxWidth: "85%",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            fontSize: "28px",
            color: "#1F2937",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Reply <strong>'YES'</strong> to this message
        </p>
      </div>

      {/* Reply input area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          transform: `scale(${pulseScale})`,
        }}
      >
        {/* Input field */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.95)",
            borderRadius: "30px",
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "#9CA3AF",
            }}
          >
            {displayText}
            <span style={{ opacity: cursorOpacity }}>|</span>
          </span>
        </div>

        {/* Send button */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
          }}
        >
          <span style={{ fontSize: "28px", color: "white" }}>➤</span>
        </div>
      </div>

      {/* Reply suggestion chip */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: "20px",
            padding: "12px 28px",
            border: "2px solid #25D366",
            boxShadow: "0 2px 10px rgba(37, 211, 102, 0.2)",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#25D366",
            }}
          >
            {replyText}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main Template Component
// ============================================

export const Template4: React.FC<Template4Props> = ({
  recipientName,
  phoneName,
  presenterImageUrl,
  customClips = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Check for active custom clip
  const activeClip = customClips.find(
    (clip) => frame >= clip.startFrame && frame < clip.endFrame
  );

  if (activeClip) {
    const clipFrame = frame - activeClip.startFrame;
    const clipDuration = activeClip.endFrame - activeClip.startFrame;
    const fadeInOut = interpolate(
      clipFrame,
      [0, 15, clipDuration - 15, clipDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill style={{ background: "#0a0a15" }}>
        {activeClip.type === "video" ? (
          <AbsoluteFill>
            <Video
              src={activeClip.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: fadeInOut,
              }}
              volume={0}
              playbackRate={1}
            />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ opacity: fadeInOut }}>
            <Img
              src={activeClip.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  }

  // ============================================
  // Scene Animations
  // ============================================

  // Scene 1: Personal Recognition (0-90 frames / 0-3s)
  const scene1Opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scene1Scale = interpolate(frame, [0, 90], [1, 1.03], {
    extrapolateRight: "clamp",
  });

  // Scene 2: Context Layer (90-210 frames / 3-7s)
  // Context icons fade in during this scene

  // Scene 3: Core Promise (210-420 frames / 7-14s)
  const promiseTextFrame = Math.max(0, frame - 240);
  const promiseOpacity = interpolate(promiseTextFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const promiseScale = spring({
    frame: promiseTextFrame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  // Scene 4: Phone Tease (420-540 frames / 14-18s)
  const phoneTeaseFrame = Math.max(0, frame - 420);
  const phoneOpacity = interpolate(
    phoneTeaseFrame,
    [0, 30, 90, 120],
    [0, 1, 1, 0.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const phoneRotation = interpolate(phoneTeaseFrame, [0, 120], [-3, 3], {
    extrapolateRight: "clamp",
  });

  // Scene 5: WhatsApp CTA (540-660 frames / 18-22s)
  const ctaFrame = Math.max(0, frame - 540);
  const ctaOpacity = interpolate(ctaFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene 6: Sign-off (660-750 frames / 22-25s)
  const outroFrame = Math.max(0, frame - 660);
  const outroDarken = interpolate(outroFrame, [0, 60, 90], [0, 0.3, 0.8], {
    extrapolateRight: "clamp",
  });
  const outroTextOpacity = interpolate(
    outroFrame,
    [20, 50, 70, 90],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Background gradient animation
  const gradientProgress = interpolate(frame, [0, 750], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${
          135 + gradientProgress * 0.1
        }deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1a 100%)`,
      }}
    >
      {/* Subtle animated gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(0, 100, 200, 0.15) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, rgba(0, 150, 255, 0.1) 0%, transparent 50%)`,
          opacity: interpolate(Math.sin(frame * 0.03), [-1, 1], [0.5, 1]),
        }}
      />

      {/* ============================================ */}
      {/* Scene 1: Personal Recognition (0-90 frames) */}
      {/* ============================================ */}
      <Sequence from={0} durationInFrames={660}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "70%",
            opacity:
              frame < 420
                ? scene1Opacity
                : interpolate(frame, [420, 450], [1, 0], {
                    extrapolateRight: "clamp",
                  }),
            transform: `scale(${scene1Scale})`,
          }}
        >
          <PresenterPlaceholder
            imageUrl={presenterImageUrl}
            opacity={1}
            scale={1}
          />
        </div>

        {/* Personal greeting - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50px",
            opacity: interpolate(frame, [15, 45, 80, 100], [0, 1, 1, 0.5], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontSize: "36px",
              fontWeight: "500",
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Hey {recipientName} 👋
          </p>
        </div>
      </Sequence>

      {/* ============================================ */}
      {/* Scene 2: Context Layer (90-210 frames) */}
      {/* ============================================ */}
      <Sequence from={90} durationInFrames={330}>
        <ContextLayer persona="multitasking" />

        {/* Context text */}
        <div
          style={{
            position: "absolute",
            bottom: "12%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame - 90, [30, 60, 90, 120], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontSize: "32px",
              fontWeight: "400",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 2px 15px rgba(0,0,0,0.5)",
            }}
          >
            Work. Messages. Everything in between.
          </p>
        </div>
      </Sequence>

      {/* ============================================ */}
      {/* Scene 3: Core Promise (210-420 frames) */}
      {/* ============================================ */}
      <Sequence from={210} durationInFrames={210}>
        {/* Abstract motion - gradient flow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          {/* Flowing gradient lines */}
          {[0, 1, 2].map((i) => {
            const lineFrame = frame - 210;
            const yPos = interpolate(
              (lineFrame + i * 40) % 180,
              [0, 180],
              [110, -10]
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "-10%",
                  right: "-10%",
                  top: `${yPos}%`,
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, rgba(0, 150, 255, ${
                    0.3 - i * 0.08
                  }), transparent)`,
                  filter: "blur(1px)",
                }}
              />
            );
          })}
        </div>

        {/* Promise text - center */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: promiseOpacity,
            transform: `scale(${promiseScale})`,
          }}
        >
          <p
            style={{
              fontSize: "52px",
              fontWeight: "600",
              color: "white",
              lineHeight: 1.3,
              textShadow: "0 4px 30px rgba(0, 150, 255, 0.3)",
              padding: "0 60px",
            }}
          >
            A phone that just keeps going.
          </p>
        </div>
      </Sequence>

      {/* ============================================ */}
      {/* Scene 4: Phone Tease (420-540 frames) */}
      {/* ============================================ */}
      <Sequence from={420} durationInFrames={120}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PhoneTease
            phoneName={phoneName}
            opacity={phoneOpacity}
            rotation={phoneRotation}
          />
        </div>

        {/* Small presenter PiP */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "50px",
            width: "150px",
            height: "200px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.2)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            opacity: interpolate(frame - 420, [30, 50], [0, 0.9], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PresenterPlaceholder
            imageUrl={presenterImageUrl}
            opacity={1}
            scale={1.2}
          />
        </div>
      </Sequence>

      {/* ============================================ */}
      {/* Scene 5: WhatsApp CTA (540-660 frames) */}
      {/* ============================================ */}
      <Sequence from={540} durationInFrames={120}>
        {/* Presenter background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "55%",
            opacity: ctaOpacity,
          }}
        >
          <PresenterPlaceholder
            imageUrl={presenterImageUrl}
            opacity={0.8}
            scale={1}
          />
        </div>

        {/* WhatsApp UI at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WhatsAppCTA replyText="YES" opacity={ctaOpacity} />
        </div>
      </Sequence>

      {/* ============================================ */}
      {/* Scene 6: Human Sign-Off (660-750 frames) */}
      {/* ============================================ */}
      <Sequence from={660}>
        {/* Presenter */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interpolate(outroFrame, [0, 20], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PresenterPlaceholder
            imageUrl={presenterImageUrl}
            opacity={1}
            scale={1}
          />
        </div>

        {/* Darkening overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0a0a15",
            opacity: outroDarken,
          }}
        />

        {/* "More soon" text */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "60px",
            opacity: outroTextOpacity,
          }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: "400",
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "2px",
            }}
          >
            More soon.
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
