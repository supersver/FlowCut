import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const combinedOpacity = interpolate(frame, [0, 30, 80, 90], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Logo Animation (Slow, purposeful scale)
  const logoScale = interpolate(frame, [0, 90], [1, 1.05]);
  const logoY = interpolate(frame, [0, 30], [20, 0], {
    extrapolateRight: "clamp",
  });

  // Light Leak Animation
  const lightLeakPos = interpolate(frame, [20, 80], [-100, 200]);

  // Tagline Entrance
  const taglineSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 60, mass: 2 }, // Heavy/Slow
  });
  const taglineY = interpolate(taglineSpring, [0, 1], [40, 0]);
  const taglineOpacity = interpolate(taglineSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // Metallic Silver/White
        opacity: combinedOpacity,
      }}
    >
      {/* Dynamic Light Leak Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "conic-gradient(from 180deg at 50% -20%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
          filter: "blur(80px)",
          opacity: 0.6,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "24px",
        }}
      >
        {/* Luxury Logo Text */}
        <div
          style={{
            position: "relative",
            transform: `translateY(${logoY}px) scale(${logoScale})`,
          }}
        >
          <h1
            style={{
              fontSize: "160px", // UPSCALE: 96px -> 160px
              fontWeight: "600",
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-4px",
              // Platinum Gradient
              background:
                "linear-gradient(180deg, #788a9e 0%, #b8c6db 40%, #ffffff 50%, #b8c6db 60%, #5d6d7e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
            }}
          >
            vivo
          </h1>

          {/* Animated Sheen on Text */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              backgroundPosition: `${lightLeakPos}% 0`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          >
            vivo
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "48px", // UPSCALE: 36px -> 48px
            fontWeight: "300",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            color: "#4a5b6d",
            letterSpacing: "4px", // More tracking for elegance
            margin: 0,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textShadow: "0 2px 4px rgba(255,255,255,0.5)",
          }}
        >
          Exclusively for you.
        </p>
      </div>

      {/* Corner Brand Accent - Platinum Star */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          right: "80px",
          width: "60px",
          height: "60px",
          background: "linear-gradient(45deg, #b8c6db, #f5f7fa)",
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          opacity: interpolate(frame, [40, 70], [0, 0.4]) * combinedOpacity,
          boxShadow: "0 0 20px rgba(255,255,255,0.8)",
        }}
      />
    </AbsoluteFill>
  );
};
