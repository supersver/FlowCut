import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

// Particle configuration for background effect
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  startX: Math.random() * 100,
  startY: Math.random() * 100,
  size: 2 + Math.random() * 4,
  speed: 0.3 + Math.random() * 0.5,
  delay: i * 3,
}));

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main entrance timing
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const combinedOpacity = fadeIn * fadeOut;

  // Darken overlay
  const darkenOpacity = interpolate(frame, [0, 40], [0, 0.85], {
    extrapolateRight: "clamp",
  });

  // Title animation with spring
  const titleSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);

  // Subtitle staggered animation
  const subtitleSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);

  // Glow pulse animation
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 0.8]
  );

  // Decorative line animation
  const lineWidth = interpolate(frame, [15, 50], [0, 180], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #0a0a15 0%, #0d0d1a 50%, #0a0a15 100%)",
          opacity: darkenOpacity,
        }}
      />

      {/* Animated particles */}
      {PARTICLES.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        const particleOpacity = interpolate(
          adjustedFrame,
          [0, 15, 60, 80],
          [0, 0.6, 0.6, 0],
          {
            extrapolateRight: "clamp",
          }
        );
        const floatY = interpolate(
          Math.sin((frame + particle.delay * 5) * 0.04 * particle.speed),
          [-1, 1],
          [-20, 20]
        );
        const floatX = interpolate(
          Math.cos((frame + particle.delay * 3) * 0.03 * particle.speed),
          [-1, 1],
          [-15, 15]
        );

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(0, 180, 255, 0.8) 0%, rgba(0, 120, 255, 0.3) 100%)`,
              boxShadow: `0 0 ${particle.size * 3}px rgba(0, 150, 255, 0.5)`,
              transform: `translate(${floatX}px, ${floatY}px)`,
              opacity: particleOpacity,
            }}
          />
        );
      })}

      {/* Central glow effect */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0, 100, 255, ${
            glowIntensity * 0.15
          }) 0%, transparent 70%)`,
          filter: "blur(60px)",
          opacity: combinedOpacity,
        }}
      />

      {/* Main content container - centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: combinedOpacity,
        }}
      >
        {/* Main title */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "700",
            color: "rgba(255, 255, 255, 0.95)",
            letterSpacing: "6px",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            margin: 0,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            textShadow: `
              0 0 40px rgba(0, 150, 255, ${glowIntensity}),
              0 4px 20px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          Coming Soon
        </h1>

        {/* Decorative animated line */}
        <div
          style={{
            width: lineWidth,
            height: "3px",
            background: `linear-gradient(90deg, transparent, rgba(0, 180, 255, ${glowIntensity}), transparent)`,
            marginTop: "24px",
            marginBottom: "24px",
            borderRadius: "2px",
            boxShadow: `0 0 20px rgba(0, 150, 255, ${glowIntensity * 0.6})`,
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: "4px",
            fontFamily: "sans-serif",
            margin: 0,
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleSpring,
          }}
        >
          Stay tuned for the reveal
        </p>
      </div>

      {/* Corner decorative elements */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          left: "60px",
          width: "80px",
          height: "80px",
          borderLeft: `2px solid rgba(0, 150, 255, ${glowIntensity * 0.5})`,
          borderBottom: `2px solid rgba(0, 150, 255, ${glowIntensity * 0.5})`,
          opacity: combinedOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "60px",
          width: "80px",
          height: "80px",
          borderRight: `2px solid rgba(0, 150, 255, ${glowIntensity * 0.5})`,
          borderTop: `2px solid rgba(0, 150, 255, ${glowIntensity * 0.5})`,
          opacity: combinedOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
