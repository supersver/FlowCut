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

// Floating orbs for background ambiance
const FLOATING_ORBS = [
  { x: 15, y: 25, size: 120, delay: 0, color: "rgba(0, 100, 255, 0.08)" },
  { x: 80, y: 70, size: 180, delay: 10, color: "rgba(0, 150, 255, 0.06)" },
  { x: 60, y: 20, size: 100, delay: 20, color: "rgba(100, 180, 255, 0.05)" },
  { x: 25, y: 75, size: 140, delay: 15, color: "rgba(0, 120, 255, 0.07)" },
];

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
  const delay = index * 8; // Stagger each word by 8 frames
  const adjustedFrame = Math.max(0, frame - delay);

  // Spring animation for each word
  const wordSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.6 },
  });

  // Word reveal animations
  const opacity = interpolate(adjustedFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(wordSpring, [0, 1], [40, 0]);
  const scale = interpolate(wordSpring, [0, 1], [0.7, 1]);

  // Subtle glow pulse for emphasized words
  const isEmphasized = word === "keeps" || word === "going.";
  const glowIntensity = isEmphasized
    ? interpolate(Math.sin((frame + index * 10) * 0.06), [-1, 1], [0.3, 0.8])
    : 0.2;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        marginRight: index < totalWords - 1 ? "18px" : "0",
        color: isEmphasized
          ? "rgba(100, 220, 255, 1)"
          : "rgba(255, 255, 255, 0.95)",
        textShadow: isEmphasized
          ? `0 0 40px rgba(0, 180, 255, ${glowIntensity}), 0 4px 20px rgba(0, 100, 255, 0.4)`
          : "0 4px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      {word}
    </span>
  );
};

export const PromiseText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overall scene opacity
  const sceneOpacity = interpolate(frame, [0, 20, 180, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated underline
  const underlineWidth = interpolate(frame, [60, 120], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const underlineOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse for background elements
  const glowPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Floating ambient orbs */}
      {FLOATING_ORBS.map((orb, i) => {
        const adjustedFrame = Math.max(0, frame - orb.delay);
        const orbOpacity = interpolate(adjustedFrame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });
        const floatY = interpolate(
          Math.sin((frame + orb.delay * 3) * 0.02),
          [-1, 1],
          [-30, 30]
        );
        const floatX = interpolate(
          Math.cos((frame + orb.delay * 2) * 0.015),
          [-1, 1],
          [-20, 20]
        );
        const orbScale = interpolate(
          Math.sin((frame + orb.delay) * 0.03),
          [-1, 1],
          [0.9, 1.1]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              transform: `translate(${floatX}px, ${floatY}px) scale(${orbScale})`,
              filter: "blur(40px)",
              opacity: orbOpacity * glowPulse,
            }}
          />
        );
      })}

      {/* Flowing gradient lines */}
      {[0, 1, 2, 3].map((i) => {
        const yPos = interpolate((frame + i * 50) % 240, [0, 240], [120, -20]);
        const lineOpacity = interpolate(frame, [10, 40], [0, 0.3 - i * 0.06], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "-10%",
              right: "-10%",
              top: `${yPos}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, rgba(0, 180, 255, ${
                0.4 - i * 0.08
              }) 50%, transparent 100%)`,
              opacity: lineOpacity,
              filter: "blur(1px)",
            }}
          />
        );
      })}

      {/* Center content container */}
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
        {/* Main promise text with staggered words */}
        <div
          style={{
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          <p
            style={{
              fontSize: "56px",
              fontWeight: "600",
              lineHeight: 1.4,
              fontFamily: "sans-serif",
              margin: 0,
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
        </div>

        {/* Animated underline */}
        <div
          style={{
            width: underlineWidth,
            height: "3px",
            background: `linear-gradient(90deg, transparent, rgba(0, 180, 255, ${
              glowPulse * 0.8
            }), transparent)`,
            marginTop: "32px",
            borderRadius: "2px",
            opacity: underlineOpacity,
            boxShadow: `0 0 20px rgba(0, 150, 255, ${glowPulse * 0.5})`,
          }}
        />

        {/* Subtle tagline */}
        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.5)",
            letterSpacing: "6px",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginTop: "40px",
            opacity: interpolate(frame, [90, 120], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [90, 120], [20, 0], {
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          Unstoppable Performance
        </p>
      </div>
    </AbsoluteFill>
  );
};
