import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

interface WhatsAppCTAProps {
  replyText?: string;
}

// Organic floating particles (Depth of Field)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 6,
  speed: 0.2 + Math.random() * 0.4,
  blur: Math.random() * 4,
  delay: i * 3,
}));

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  replyText = "YES",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const containerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CLICK ANIMATION PHYSICS
  // Trigger click at frame 50
  const clickSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.6 }, // Snappy click
  });

  // Scale down quickly then bounce back
  const buttonScale = interpolate(clickSpring, [0, 0.3, 1], [1, 0.9, 1]);

  // Brightness flash on click
  const buttonBrightness = interpolate(clickSpring, [0, 0.2, 1], [1, 1.3, 1]);

  // Ripple/Burst Effect
  const rippleScale = interpolate(clickSpring, [0, 1], [0.8, 2]);
  const rippleOpacity = interpolate(clickSpring, [0, 0.2, 1], [0, 0.6, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 30%, #0f1c30 0%, #050a15 100%)",
        opacity: containerOpacity,
        overflow: "hidden",
      }}
    >
      {/* Noise Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          filter: "contrast(200%) brightness(100%)",
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Depth of Field Particles */}
      {PARTICLES.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        const floatY = interpolate(
          Math.sin((frame + particle.delay * 5) * 0.03 * particle.speed),
          [-1, 1],
          [-15, 15]
        );

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: "rgba(100, 200, 255, 0.6)",
              boxShadow: `0 0 ${particle.size * 2}px rgba(100, 200, 255, 0.4)`,
              transform: `translate(0, ${floatY}px)`,
              opacity: 0.4,
              filter: `blur(${particle.blur}px)`,
            }}
          />
        );
      })}

      {/* Main Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glass Chat Interface */}
        <div
          style={{
            width: "90%",
            maxWidth: "800px",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "40px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: `
              0 40px 80px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            padding: "50px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top Highlight Shine */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            }}
          />

          {/* Background Blurred Chats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "50px",
              opacity: 0.3,
              filter: "blur(4px)",
            }}
          >
            <div
              style={{
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.2)",
                padding: "18px 24px",
                borderRadius: "20px 20px 20px 6px",
                maxWidth: "60%",
              }}
            ></div>
            <div
              style={{
                alignSelf: "flex-end",
                background: "rgba(100,180,255,0.3)",
                padding: "18px 40px",
                borderRadius: "20px 20px 6px 20px",
                maxWidth: "40%",
              }}
            ></div>
            <div
              style={{
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.2)",
                padding: "18px 30px",
                borderRadius: "20px 20px 20px 6px",
                maxWidth: "50%",
              }}
            ></div>
          </div>

          {/* Main CTA Interaction Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              // Use spring interaction
              transform: `scale(${buttonScale})`,
              filter: `brightness(${buttonBrightness})`,
            }}
          >
            {/* Glowing Input Bubble */}
            <div
              style={{
                position: "relative",
                background: "rgba(0, 120, 255, 0.1)",
                border: "2px solid rgba(100, 200, 255, 0.5)",
                borderRadius: "100px",
                padding: "24px 60px",
                boxShadow: `
                   0 0 40px rgba(0, 150, 255, 0.2),
                   inset 0 0 20px rgba(0, 100, 255, 0.1)
                 `,
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontSize: "48px",
                  fontWeight: "600",
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "1px",
                  textShadow: "0 0 30px rgba(100, 200, 255, 0.8)",
                }}
              >
                Type '{replyText}' below
              </span>

              {/* Cursor Blink */}
              <div
                style={{
                  position: "absolute",
                  right: "40px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "3px",
                  height: "40px",
                  background: "rgba(255, 255, 255, 0.8)",
                  opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                }}
              />
            </div>

            {/* Ripple Burst Effect (Behind button) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                transform: `translate(-50%, -50%) scale(${rippleScale})`,
                borderRadius: "100px",
                border: "4px solid rgba(100, 200, 255, 0.8)",
                opacity: rippleOpacity,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
