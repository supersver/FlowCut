import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// The promise text split into words for staggered animation
const PROMISE_WORDS = ["A", "phone", "that", "just", "keeps", "going."];

interface WordProps {
  word: string;
  index: number;
  frame: number;
  fps: number;
  totalWords: number;
}

const AnimatedWord: React.FC<WordProps> = ({
  word,
  index,
  frame,
  fps,
  totalWords,
}) => {
  const delay = index * 5; // Faster stagger
  const adjustedFrame = Math.max(0, frame - delay);

  // Spring animation for each word
  const wordSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
  });

  const translateY = interpolate(wordSpring, [0, 1], [20, 0]);
  const opacity = interpolate(adjustedFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const isEmphasized = word === "keeps" || word === "going.";

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px)`,
        marginRight: index < totalWords - 1 ? "18px" : "0",
        // Blue text for emphasis, Dark Gray for normal
        color: isEmphasized ? "#0266b8" : "#1F2937",
        fontWeight: isEmphasized ? "800" : "600",
        // Simple elegant text shadow
        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
      }}
    >
      {word}
    </span>
  );
};

export const PromiseText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Banner Entrance Expansion (Left to Right)
  const expandSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
  });

  const widthPercentage = interpolate(expandSpring, [0, 1], [0, 100]);
  const contentOpacity = interpolate(expandSpring, [0.3, 1], [0, 1]);

  // Scene Opacity
  const sceneOpacity = interpolate(frame, [0, 20, 180, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Banner Container - Bottom Centered (Lower Third) */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "60px",
        }}
      >
        {/* Main Glass Banner */}
        <div
          style={{
            position: "relative",
            width: `${widthPercentage}%`,
            height: "180px", // Slightly taller for promise text
            // EXACT ContextLayer Styling
            background:
              "linear-gradient(180deg, rgba(235, 240, 245, 0.7) 0%, rgba(220, 230, 240, 0.5) 100%)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "60px",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.1),
              inset 0 0 0 2px rgba(255, 255, 255, 0.5)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column", // Stack tagline if needed, but keeping simple for now
            gap: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Content */}
          <div
            style={{
              opacity: contentOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "56px",
                fontFamily:
                  "sf pro display, -apple-system, blinkmacsystemfont, segoe ui, roboto, helvetica, arial, sans-serif",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              {PROMISE_WORDS.map((word, index) => (
                <AnimatedWord
                  key={index}
                  word={word}
                  index={index}
                  frame={frame}
                  fps={fps}
                  totalWords={PROMISE_WORDS.length}
                />
              ))}
            </p>

            {/* Tagline */}
            <div
              style={{
                marginTop: "12px",
                fontSize: "18px",
                fontWeight: "500",
                color: "rgba(0,0,0,0.5)",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Unstoppable Performance
            </div>
          </div>

          {/* Sheen animation */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
              transform: `translateX(${interpolate(
                frame,
                [20, 80],
                [-100, 100]
              )}%)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
