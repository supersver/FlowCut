import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface PhoneTeaseProps {
  phoneName: string;
  productImageUrl?: string;
}

// Feature bubbles data
const FEATURE_BUBBLES = [
  { text: "Faster RAM", angle: 30, distance: 420, delay: 10, size: "medium" },
  { text: "Faster CPU", angle: 350, distance: 350, delay: 20, size: "large" },
  { text: "More Space", angle: 150, distance: 340, delay: 5, size: "medium" },
  {
    text: "200x Zoom Camera",
    angle: 210,
    distance: 440,
    delay: 25,
    size: "large",
  },
  {
    text: "Bigger Battery",
    angle: 280,
    distance: 520,
    delay: 15,
    size: "large",
  },
];

interface FeatureBubbleProps {
  text: string;
  angle: number;
  distance: number;
  delay: number;
  size: "small" | "medium" | "large";
  frame: number;
}

const FeatureBubble: React.FC<FeatureBubbleProps> = ({
  text,
  angle,
  distance,
  delay,
  size,
  frame,
}) => {
  // Entrance animation with delay
  const adjustedFrame = Math.max(0, frame - delay);

  const opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(adjustedFrame, [0, 25], [0.3, 1], {
    extrapolateRight: "clamp",
  });

  // Floating motion - each bubble has slightly different speed
  const floatOffset = interpolate(
    Math.sin((frame + delay * 5) * 0.03),
    [-1, 1],
    [-12, 12]
  );

  const floatOffsetX = interpolate(
    Math.cos((frame + delay * 3) * 0.025),
    [-1, 1],
    [-8, 8]
  );

  // Calculate position based on angle and distance
  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * distance + floatOffsetX;
  const y = Math.sin(angleRad) * distance + floatOffset;

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin((frame + delay * 2) * 0.06),
    [-1, 1],
    [0.3, 0.7]
  );

  // Size styles
  const sizeStyles = {
    small: { padding: "10px 18px", fontSize: "18px" },
    medium: { padding: "14px 24px", fontSize: "22px" },
    large: { padding: "16px 28px", fontSize: "24px" },
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
        opacity,
        ...sizeStyles[size],
        background: `linear-gradient(135deg, rgba(0, 120, 255, ${
          0.15 + glowIntensity * 0.1
        }) 0%, rgba(100, 180, 255, ${0.1 + glowIntensity * 0.05}) 100%)`,
        backdropFilter: "blur(10px)",
        borderRadius: "50px",
        border: `2px solid rgba(0, 180, 255, ${0.3 + glowIntensity * 0.3})`,
        boxShadow: `
          0 0 30px rgba(0, 150, 255, ${glowIntensity * 0.4}),
          0 8px 32px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
        whiteSpace: "nowrap",
        zIndex: 5,
      }}
    >
      <span
        style={{
          color: "rgba(255, 255, 255, 0.95)",
          fontFamily: "sans-serif",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textShadow: `0 0 20px rgba(0, 180, 255, ${glowIntensity})`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const PhoneTease: React.FC<PhoneTeaseProps> = ({
  phoneName,
  productImageUrl,
}) => {
  const frame = useCurrentFrame();

  // Entrance animations
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(frame, [0, 120], [-3, 3], {
    extrapolateRight: "clamp",
  });

  // Floating animation
  const floatY = interpolate(Math.sin(frame * 0.04), [-1, 1], [-8, 8]);

  // Scale reveal
  const revealScale = interpolate(frame, [0, 90], [0.9, 1], {
    extrapolateRight: "clamp",
  });

  // Light sweep
  const sweepPosition = interpolate(frame % 90, [0, 90], [-50, 150]);

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 0.8]
  );
  const screenPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.8, 1]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `rotate(${rotation}deg) translateY(${floatY}px) scale(${revealScale})`,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Feature Bubbles */}
      {FEATURE_BUBBLES.map((bubble, index) => (
        <FeatureBubble
          key={index}
          text={bubble.text}
          angle={bubble.angle}
          distance={bubble.distance}
          delay={bubble.delay}
          size={bubble.size as "small" | "medium" | "large"}
          frame={frame}
        />
      ))}

      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          width: productImageUrl ? "500px" : "420px",
          height: productImageUrl ? "500px" : "800px",
          borderRadius: productImageUrl ? "50%" : "70px",
          background: `radial-gradient(ellipse at center, rgba(0, 150, 255, ${
            glowIntensity * 0.4
          }) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Conditional: Product Image OR Phone Silhouette */}
      {productImageUrl ? (
        /* Product Image (shown directly when productImageUrl is provided) */
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* Product image with glow effect */}
          <div
            style={{
              position: "relative",
              maxWidth: "500px",
              maxHeight: "600px",
            }}
          >
            {/* Glow behind image */}
            <div
              style={{
                position: "absolute",
                inset: "-40px",
                background: `radial-gradient(ellipse at center, rgba(0, 150, 255, ${
                  glowIntensity * 0.5
                }) 0%, transparent 70%)`,
                filter: "blur(30px)",
              }}
            />
            <img
              src={productImageUrl}
              alt="Product"
              style={{
                position: "relative",
                width: "100%",
                height: "auto",
                maxHeight: "600px",
                objectFit: "contain",
                opacity: interpolate(frame, [10, 40], [0, 1], {
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(frame, [10, 40], [0.85, 1], {
                  extrapolateRight: "clamp",
                })})`,
                filter: `drop-shadow(0 20px 60px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 40px rgba(0, 150, 255, ${
                  glowIntensity * 0.4
                }))`,
                borderRadius: "20px",
              }}
            />
          </div>

          {/* Phone name text */}
          <p
            style={{
              marginTop: "50px",
              fontSize: "42px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "8px",
              textTransform: "uppercase",
              textShadow: `0 0 40px rgba(0, 150, 255, ${glowIntensity})`,
              fontFamily: "sans-serif",
            }}
          >
            {phoneName}
          </p>
        </div>
      ) : (
        /* Phone Silhouette (shown when no product image) */
        <>
          <div
            style={{
              position: "relative",
              width: "340px",
              height: "720px",
              borderRadius: "56px",
              background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
              border: "5px solid rgba(255,255,255,0.2)",
              boxShadow: `
                0 0 100px rgba(0, 150, 255, ${glowIntensity}),
                0 0 50px rgba(0, 200, 255, ${glowIntensity * 0.5}),
                0 40px 80px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.15)
              `,
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {/* Camera module */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "120px",
                borderRadius: "32px",
                background: "linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)",
                border: "3px solid rgba(255,255,255,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "inset 0 3px 6px rgba(0,0,0,0.5)",
              }}
            >
              {/* Main camera lens */}
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #1e4a6f 0%, #0a1929 70%)",
                  border: "4px solid rgba(0, 180, 255, 0.6)",
                  boxShadow: `
                    inset 0 0 20px rgba(0, 150, 255, 0.4),
                    0 0 15px rgba(0, 150, 255, ${glowIntensity * 0.5})
                  `,
                }}
              />
              {/* Secondary lens */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #2a2a4a 0%, #0a0a1a 70%)",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {/* Screen area with glow */}
            <div
              style={{
                position: "absolute",
                top: "165px",
                left: "14px",
                right: "14px",
                bottom: "28px",
                borderRadius: "44px",
                background: "linear-gradient(180deg, #0a0a15 0%, #12121f 100%)",
                overflow: "hidden",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* Screen content glow */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse at 50% 30%, rgba(0, 180, 255, ${
                    glowIntensity * 0.5 * screenPulse
                  }) 0%, transparent 60%)`,
                }}
              />
              {/* UI elements hint */}
              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  right: "24px",
                  height: "14px",
                  borderRadius: "7px",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "52px",
                  left: "24px",
                  width: "60%",
                  height: "10px",
                  borderRadius: "5px",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* Edge highlight sweep */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${sweepPosition}%`,
                width: "40px",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                transform: "skewX(-20deg)",
              }}
            />

            {/* Top edge highlight */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </div>

          {/* Phone name text */}
          <p
            style={{
              marginTop: "50px",
              fontSize: "42px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "8px",
              textTransform: "uppercase",
              textShadow: `0 0 40px rgba(0, 150, 255, ${glowIntensity})`,
              fontFamily: "sans-serif",
              zIndex: 10,
            }}
          >
            {phoneName}
          </p>
        </>
      )}
    </div>
  );
};
