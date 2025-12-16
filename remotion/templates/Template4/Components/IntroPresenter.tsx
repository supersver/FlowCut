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

// Floating particles for ambient effect
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 10 + i * 12,
  y: 30 + (i % 3) * 25,
  size: 3 + (i % 3) * 2,
  delay: i * 4,
  speed: 0.8 + (i % 2) * 0.4,
}));

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
    config: { damping: 18, stiffness: 90, mass: 0.7 },
  });

  // Map spring 0-1 to percent/px width
  const widthPercent = interpolate(cardWidth, [0, 1], [0, 100]);

  // Text Content Animation
  const textSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.5 },
  });

  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textScale = interpolate(textSpring, [0, 1], [0.9, 1]);

  // Slide/Fade Out at end of scene (frame 80-90)
  const exitProgress = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitY = interpolate(exitProgress, [0, 1], [0, 30]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.95]);
  const containerOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Glow pulse effect
  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6]);

  // Wave emoji animation
  const waveRotation = interpolate(Math.sin(frame * 0.3), [-1, 1], [-15, 15]);

  // Shimmer effect position
  const shimmerX = interpolate(frame, [20, 70], [-100, 200], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Ambient floating particles */}
      {PARTICLES.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        const particleOpacity = interpolate(
          adjustedFrame,
          [0, 20, 70, 90],
          [0, 0.4, 0.4, 0],
          {
            extrapolateRight: "clamp",
          }
        );
        const floatY = interpolate(
          Math.sin((frame + particle.delay * 3) * 0.04 * particle.speed),
          [-1, 1],
          [-15, 15]
        );
        const floatX = interpolate(
          Math.cos((frame + particle.delay * 2) * 0.03 * particle.speed),
          [-1, 1],
          [-10, 10]
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
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(200, 230, 255, 0.5) 100%)",
              boxShadow: `0 0 ${particle.size * 4}px rgba(100, 180, 255, 0.4)`,
              transform: `translate(${floatX}px, ${floatY}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50px",
          height: "170px",
          display: "flex",
          alignItems: "center",
          opacity: containerOpacity,
          transform: `translateY(${exitY}px) scale(${exitScale})`,
        }}
      >
        {/* Glow effect behind card */}
        <div
          style={{
            position: "absolute",
            left: "-30px",
            top: "-30px",
            right: "-30px",
            bottom: "-30px",
            background: `radial-gradient(ellipse at center, rgba(100, 180, 255, ${
              glowIntensity * 0.3
            }) 0%, transparent 70%)`,
            filter: "blur(30px)",
            opacity: widthPercent / 100,
          }}
        />

        {/* Main Card with Gradient */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(widthPercent * 9.5, 950)}px`,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.95) 50%, rgba(230, 245, 255, 0.98) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            borderRadius: "24px",
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.15),
              0 8px 25px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 1),
              0 0 40px rgba(100, 180, 255, ${glowIntensity * 0.2})
            `,
            overflow: "hidden",
            transformOrigin: "left center",
          }}
        >
          {/* Animated shimmer effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shimmerX}%`,
              width: "80px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
              transform: "skewX(-20deg)",
              opacity: interpolate(widthPercent, [80, 100], [0.8, 0], {
                extrapolateRight: "clamp",
              }),
            }}
          />

          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "24px",
              right: "24px",
              height: "3px",
              background:
                "linear-gradient(90deg, rgba(100, 180, 255, 0.8), rgba(150, 200, 255, 0.4), rgba(100, 180, 255, 0.8))",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>

        {/* Content Container */}
        <div
          style={{
            position: "relative",
            padding: "0 40px",
            opacity: textOpacity,
            transform: `scale(${textScale})`,
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: "64px",
              fontWeight: "500",
              background:
                "linear-gradient(135deg, #1a1a2e 0%, #2d3748 50%, #1a1a2e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Inter', system-ui, sans-serif",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Hey{" "}
            <span
              style={{
                fontWeight: "700",
                background:
                  "linear-gradient(135deg, #0066cc 0%, #0099ff 50%, #0066cc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {recipientName}
            </span>
            <span
              style={{
                display: "inline-block",
                marginLeft: "12px",
                transform: `rotate(${waveRotation}deg)`,
                transformOrigin: "bottom center",
                WebkitTextFillColor: "initial",
              }}
            >
              👋
            </span>
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
