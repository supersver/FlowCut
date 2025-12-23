import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface GreetingBannerProps {
  recipientName: string;
}

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  recipientName,
}) => {
  const frame = useCurrentFrame();

  // Animation timing (scene is 0-90 frames)
  // Fade in + slide up: 0-15 frames
  // Hold: 15-75 frames
  // Fade out: 75-90 frames

  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 15], [40, 0], {
    extrapolateRight: "clamp",
  });

  // Subtle scale animation for polish
  const scale = interpolate(frame, [0, 15], [0.92, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "15%",
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
        opacity,
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "32px 60px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
          border: `3px solid ${HDFC_BLUE}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "62px",
            fontWeight: 500,
            color: "#111928",
          }}
        >
          Hello{" "}
          <span style={{ fontWeight: 700, color: HDFC_BLUE }}>
            {recipientName}
          </span>
        </span>
      </div>
    </div>
  );
};
