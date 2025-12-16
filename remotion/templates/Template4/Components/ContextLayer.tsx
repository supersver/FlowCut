import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

// Icon configuration with enhanced styling
const FLOATING_ICONS = [
  { emoji: "📱", x: 12, y: 18, delay: 0, scale: 1 },
  { emoji: "💬", x: 82, y: 32, delay: 8, scale: 1.1 },
  { emoji: "📅", x: 20, y: 72, delay: 16, scale: 0.9 },
  { emoji: "📧", x: 78, y: 68, delay: 12, scale: 1 },
  { emoji: "🔔", x: 8, y: 48, delay: 20, scale: 0.95 },
  { emoji: "⚡", x: 88, y: 52, delay: 4, scale: 1.05 },
  { emoji: "📊", x: 50, y: 15, delay: 24, scale: 0.9 },
  { emoji: "🎯", x: 45, y: 78, delay: 10, scale: 1 },
];

// Text words with emphasis configuration
const CONTEXT_WORDS = [
  { text: "Work.", emphasis: false, delay: 0 },
  { text: "Messages.", emphasis: false, delay: 8 },
  { text: "Everything", emphasis: true, delay: 16 },
  { text: "in", emphasis: false, delay: 22 },
  { text: "between.", emphasis: false, delay: 28 },
];

interface FloatingIconProps {
  emoji: string;
  x: number;
  y: number;
  delay: number;
  scale: number;
  frame: number;
  fps: number;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  emoji,
  x,
  y,
  delay,
  scale: baseScale,
  frame,
  fps,
}) => {
  const adjustedFrame = Math.max(0, frame - delay);

  // Spring entrance
  const entranceSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const opacity = interpolate(entranceSpring, [0, 1], [0, 0.85]);
  const scale = interpolate(entranceSpring, [0, 1], [0.3, baseScale]);

  // Continuous floating motion
  const driftX = interpolate(
    Math.sin((frame + delay * 3) * 0.025),
    [-1, 1],
    [-18, 18]
  );
  const driftY = interpolate(
    Math.cos((frame + delay * 2) * 0.02),
    [-1, 1],
    [-12, 12]
  );

  // Subtle rotation
  const rotation = interpolate(
    Math.sin((frame + delay) * 0.03),
    [-1, 1],
    [-8, 8]
  );

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin((frame + delay * 2) * 0.06),
    [-1, 1],
    [0.2, 0.5]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(${driftX}px, ${driftY}px) rotate(${rotation}deg) scale(${scale})`,
        opacity,
      }}
    >
      {/* Glowing bubble background */}
      <div
        style={{
          position: "absolute",
          inset: "-20px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(100, 180, 255, ${
            glowIntensity * 0.3
          }) 0%, transparent 70%)`,
          filter: "blur(15px)",
        }}
      />
      {/* Icon container */}
      <div
        style={{
          position: "relative",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(8px)",
          border: `1px solid rgba(255, 255, 255, ${
            0.15 + glowIntensity * 0.1
          })`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.2),
            0 0 30px rgba(100, 180, 255, ${glowIntensity * 0.3}),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        <span style={{ fontSize: "42px" }}>{emoji}</span>
      </div>
    </div>
  );
};

interface AnimatedWordProps {
  text: string;
  emphasis: boolean;
  delay: number;
  frame: number;
  fps: number;
  index: number;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({
  text,
  emphasis,
  delay,
  frame,
  fps,
  index,
}) => {
  const adjustedFrame = Math.max(0, frame - delay);

  // Spring animation for bounce effect
  const wordSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
  const translateY = interpolate(wordSpring, [0, 1], [30, 0]);
  const scale = interpolate(wordSpring, [0, 1], [0.8, 1]);

  // Glow for emphasized word
  const glowIntensity = emphasis
    ? interpolate(Math.sin((frame + index * 10) * 0.08), [-1, 1], [0.4, 0.8])
    : 0;

  return (
    <span
      style={{
        display: "inline-block",
        fontSize: emphasis ? "52px" : "44px",
        fontWeight: emphasis ? "700" : "500",
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: emphasis ? "2px" : "0.5px",
        margin: "0 10px",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...(emphasis
          ? {
              background:
                "linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: `drop-shadow(0 0 20px rgba(0, 180, 255, ${glowIntensity}))`,
            }
          : {
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.4)",
            }),
      }}
    >
      {text}
    </span>
  );
};

export const ContextLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated underline
  const underlineWidth = interpolate(frame, [50, 90], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const underlineOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scene exit
  const exitOpacity = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: exitOpacity }}>
      {/* Floating Icons */}
      {FLOATING_ICONS.map((icon, idx) => (
        <FloatingIcon
          key={idx}
          emoji={icon.emoji}
          x={icon.x}
          y={icon.y}
          delay={icon.delay}
          scale={icon.scale}
          frame={frame}
          fps={fps}
        />
      ))}

      {/* Context Text Container */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Words row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            flexWrap: "wrap",
            padding: "0 40px",
          }}
        >
          {CONTEXT_WORDS.map((word, idx) => (
            <AnimatedWord
              key={idx}
              text={word.text}
              emphasis={word.emphasis}
              delay={word.delay}
              frame={frame}
              fps={fps}
              index={idx}
            />
          ))}
        </div>

        {/* Animated underline */}
        <div
          style={{
            width: underlineWidth,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.8), transparent)",
            marginTop: "24px",
            borderRadius: "2px",
            opacity: underlineOpacity,
            boxShadow: "0 0 20px rgba(0, 150, 255, 0.5)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
