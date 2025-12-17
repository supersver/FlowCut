import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

interface IntroPresenterProps {
  recipientName: string;
}

export const IntroPresenter: React.FC<IntroPresenterProps> = ({
  recipientName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Banner Expansion Animation (Left to Right)
  const expandSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
  });

  const widthPercentage = interpolate(expandSpring, [0, 1], [0, 100]);
  const contentOpacity = interpolate(expandSpring, [0.3, 1], [0, 1]);

  // Organic wave animation
  const waveRotation = interpolate(Math.sin(frame * 0.2), [-1, 1], [-20, 20]);

  // Exit Animation (Clip from Left to Right or Fade)
  const exitProgress = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const containerOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Banner Container - Bottom Centered */}
      <div
        style={{
          position: "absolute",
          bottom: "100px", // Lower third position
          left: "50%",
          transform: "translateX(-50%)",
          opacity: containerOpacity,
          width: "90%", // Max width container
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center", // Center alignment
          overflow: "hidden", // Important for expanding effect
          borderRadius: "60px", // Match ContextLayer radius
        }}
      >
        {/* Main Banner - Expanding Glass */}
        <div
          style={{
            position: "relative",
            width: `${widthPercentage}%`, // Animating Width
            minWidth: "120px", // Minimum to avoid complete collapse on bounce
            height: "160px", // Fixed height for banner
            // EXACT ContextLayer Glass Style
            background:
              "linear-gradient(180deg, rgba(235, 240, 245, 0.7) 0%, rgba(220, 230, 240, 0.5) 100%)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "60px", // Match ContextLayer
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.1),
              inset 0 0 0 2px rgba(255, 255, 255, 0.5)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            whiteSpace: "nowrap", // Prevent text wrap during expansion
            overflow: "hidden",
            margin: "0 auto", // Center in container
          }}
        >
          {/* Content Container - fades in as banner expands */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              opacity: contentOpacity,
              transform: `scale(${interpolate(
                expandSpring,
                [0, 1],
                [1.1, 1]
              )})`, // Subtle zoom out
            }}
          >
            {/* Text Content */}
            <span
              style={{
                fontSize: "64px",
                fontWeight: "600",
                color: "#1a1a1a",
                fontFamily:
                  "sf pro display, -apple-system, blinkmacsystemfont, segoe ui, roboto, helvetica, arial, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Hi {recipientName}
            </span>

            {/* Animated Wave Emoji */}
            <span
              style={{
                display: "inline-block",
                fontSize: "64px",
                transform: `rotate(${waveRotation}deg)`,
                transformOrigin: "bottom center",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              }}
            >
              👋
            </span>
          </div>

          {/* Decorative sheen */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              transform: `translateX(${interpolate(
                frame,
                [0, 60],
                [-100, 100]
              )}%)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
