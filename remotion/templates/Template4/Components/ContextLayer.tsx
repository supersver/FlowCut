import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from "remotion";

export const ContextLayer: React.FC = () => {
  const frame = useCurrentFrame();

  // Floating icons configuration
  const icons = [
    { emoji: "📱", x: 15, y: 20, delay: 0 },
    { emoji: "💬", x: 80, y: 35, delay: 10 },
    { emoji: "📅", x: 25, y: 70, delay: 20 },
    { emoji: "📧", x: 75, y: 65, delay: 15 },
    { emoji: "🔔", x: 10, y: 45, delay: 25 },
    { emoji: "⚡", x: 85, y: 50, delay: 5 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {icons.map((icon, idx) => {
        // Adjust frame relative to component start if used in Sequence,
        // but here we assume it's controlled by parent timing or relative frame 0 of this component
        const iconFrame = Math.max(0, frame - icon.delay);

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

      {/* Context Text Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            padding: "0 40px",
          }}
        >
          {["Work.", "Messages.", "Everything", "in", "between."].map(
            (word, idx) => {
              const wordDelay = idx * 10;
              const wordFrame = Math.max(0, frame - wordDelay);
              const wordOpacity = interpolate(wordFrame, [0, 15], [0, 1], {
                extrapolateRight: "clamp",
              });
              const wordY = interpolate(wordFrame, [0, 15], [20, 0], {
                extrapolateRight: "clamp",
              });

              return (
                <span
                  key={idx}
                  style={{
                    fontSize: "36px",
                    fontWeight: word === "Everything" ? "600" : "400",
                    color:
                      word === "Everything"
                        ? "rgba(100, 200, 255, 1)"
                        : "rgba(255,255,255,0.9)",
                    textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                    opacity: wordOpacity,
                    transform: `translateY(${wordY}px)`,
                    display: "inline-block",
                    fontFamily: "sans-serif",
                  }}
                >
                  {word}
                </span>
              );
            }
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
