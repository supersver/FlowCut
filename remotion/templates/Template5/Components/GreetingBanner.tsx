import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface GreetingBannerProps {
  recipientName: string;
}

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

  const translateY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Subtle scale animation for polish
  const scale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "120px",
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
        opacity,
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "20px 40px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: "32px",
            fontWeight: 400,
            color: "#1a1a2e",
          }}
        >
          Hello{" "}
          <span style={{ fontWeight: 700, color: "#8B0000" }}>
            {recipientName}
          </span>
        </span>
      </div>
    </div>
  );
};
