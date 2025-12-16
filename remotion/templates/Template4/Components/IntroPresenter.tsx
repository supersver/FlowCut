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

  // Animation Timeline
  // 0-15: Initial delay/video fade in
  // 15-45: Card Reveal (Center -> Out)
  // 45-60: Content Fade In

  // Card Width Animation (Center expand)
  const cardWidth = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  // Map spring 0-1 to percent/px width
  const widthPercent = interpolate(cardWidth, [0, 1], [0, 100]); // 0 to 100% of max width

  // Text Content Opacity
  const textOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Slide/Fade Out at end of scene (frame 80-90)
  const exitProgress = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, 20]);
  const containerOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "50px", // Fixed left position anchor
          height: "90px", // Fixed height
          display: "flex",
          alignItems: "center",
          opacity: containerOpacity,
          transform: `translateY(${exitY}px)`,
        }}
      >
        {/* Reveal Card Background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(widthPercent * 4.5, 450)}px`, // Expands to max 450px
            background: "white",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            overflow: "hidden", // Clip content during reveal
            transformOrigin: "left center", // Grow from left since we anchored parent
          }}
        >
          {/* Decorative slide shimmer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "4px",
              background: "rgba(255,255,255,0.6)",
              opacity: interpolate(widthPercent, [0, 100], [1, 0]), // Show line only during expansion
            }}
          />
        </div>

        {/* Content Container (Revealed by width) */}
        <div
          style={{
            position: "relative",
            padding: "0 30px",
            opacity: textOpacity,
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: "42px",
              fontWeight: "500",
              color: "black",
              fontFamily: "'Inter', system-ui, sans-serif",
              margin: 0,
              letterSpacing: "-0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Hey <span style={{ fontWeight: "700" }}>{recipientName}</span> 👋
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
