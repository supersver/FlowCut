import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface PhoneTeaseProps {
  phoneName: string;
  productImageUrl?: string;
}

export const PhoneTease: React.FC<PhoneTeaseProps> = ({
  phoneName,
  productImageUrl,
}) => {
  const frame = useCurrentFrame();

  // Smoother Entrance
  const opacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Premium Floating animation
  const floatY = interpolate(Math.sin(frame * 0.03), [-1, 1], [-12, 12]);

  // Scale reveal (Starts smaller for drama)
  const revealScale = interpolate(frame, [0, 90], [0.9, 1.15], {
    // UPSCALE: End scale 1.15
    extrapolateRight: "clamp",
  });

  // Glow pulse - coordinated layers
  const glowPulse1 = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.6, 1]); // Main
  const glowPulse2 = interpolate(
    Math.sin(frame * 0.07 + 1),
    [-1, 1],
    [0.4, 0.8]
  ); // Secondary

  // Spiraling screen animation
  const spiralRotation = interpolate(frame, [0, 150], [0, 240]);

  // God Rays Rotation
  const raysRotation = interpolate(frame, [0, 300], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #020205 0%, #080a14 100%)",
        perspective: "1000px", // For floor reflection 3D feel
      }}
    >
      {/* Volumetric "God Rays" Background */}
      <div
        style={{
          position: "absolute",
          inset: "-50%", // Oversize to cover rotation
          width: "200%",
          height: "200%",
          background: `
            conic-gradient(
              from ${raysRotation}deg at 50% 50%, 
              transparent 0deg, 
              rgba(0, 100, 255, 0.03) 15deg, 
              transparent 30deg, 
              rgba(0, 150, 255, 0.05) 50deg, 
              transparent 70deg,
              rgba(0, 100, 255, 0.04) 90deg,
              transparent 120deg,
              rgba(0, 150, 255, 0.06) 160deg,
              transparent 200deg
            )
          `,
          filter: "blur(40px)",
          mixBlendMode: "screen",
          opacity: 0.8,
        }}
      />

      {/* Main container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: `translateY(${floatY}px) scale(${revealScale})`,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Floor Reflection (Blurred duplicate flipped) */}
        {!productImageUrl && (
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "50%",
              transform: "translateX(-50%) scaleY(-1) translateY(45%)", // Flip and position below
              width: "380px",
              height: "750px",
              background: "linear-gradient(180deg, #0a0a12 0%, #08080f 100%)",
              borderRadius: "52px",
              opacity: 0.15,
              filter: "blur(20px)",
              zIndex: 0,
            }}
          />
        )}

        {/* Multi-layered radial glow effects (Behind Phone) */}
        <div
          style={{
            position: "absolute",
            width: "900px", // UPSCALE: Wider glow
            height: "1000px",
            background: `radial-gradient(ellipse at center, 
              rgba(0, 150, 255, ${0.2 * glowPulse1}) 0%, 
              rgba(10, 30, 80, 0) 60%)`,
            filter: "blur(80px)",
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "800px",
            background: `radial-gradient(ellipse at center, 
              rgba(50, 180, 255, ${0.3 * glowPulse2}) 0%, 
              transparent 70%)`,
            filter: "blur(50px)",
            mixBlendMode: "color-dodge", // Intense core
          }}
        />

        {/* Conditional: Product Image OR Phone Silhouette */}
        {productImageUrl ? (
          /* Product Image Display */
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={productImageUrl}
              alt="Product"
              style={{
                maxWidth: "450px", // UPSCALE: 380px -> 450px
                maxHeight: "650px",
                objectFit: "contain",
                filter: `drop-shadow(0 0 60px rgba(0, 150, 255, ${
                  glowPulse1 * 0.5
                }))`,
                transform: "perspective(1000px) rotateY(-5deg)", // Subtle 3D turn
              }}
            />
          </div>
        ) : (
          /* Phone Silhouette with glowing screen */
          <div
            style={{
              position: "relative",
              width: "380px", // UPSCALE: 320px -> 380px
              height: "780px", // UPSCALE: 680px -> 780px
              borderRadius: "60px",
              background: "linear-gradient(180deg, #0a0a12 0%, #08080f 100%)",
              border: "4px solid rgba(80, 160, 255, 0.4)",
              boxShadow: `
                0 0 100px rgba(0, 150, 255, ${glowPulse1 * 0.6}),
                inset 0 0 40px rgba(0, 100, 255, 0.2)
              `,
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {/* Notch/Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "36px",
                height: "36px",
                borderRadius: "24px",
                background: "#000",
                zIndex: 20,
              }}
            />

            {/* Screen area with spiraling glow animation */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                right: "10px",
                bottom: "10px",
                borderRadius: "50px",
                background: "#050508",
                overflow: "hidden",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
              }}
            >
              {/* High-res Spiraling effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "-50%",
                  width: "200%",
                  height: "200%",
                  background: `
                    conic-gradient(
                      from ${spiralRotation}deg at 50% 50%,
                      rgba(0, 150, 255, 0) 0deg,
                      rgba(0, 150, 255, 0.5) 40deg,
                      rgba(50, 200, 255, 0.8) 50deg, /* Sharp highlight */
                      rgba(0, 150, 255, 0.1) 100deg,
                      rgba(0, 150, 255, 0) 180deg,
                      rgba(0, 100, 255, 0.3) 270deg,
                      rgba(0, 150, 255, 0) 360deg
                    )
                  `,
                  opacity: glowPulse1,
                  mixBlendMode: "screen",
                  filter: "blur(5px)", // Less blur for sharper detail
                }}
              />

              {/* Offset chromatic aberration effect (Cyan layer) */}
              <div
                style={{
                  position: "absolute",
                  inset: "-50%",
                  width: "200%",
                  height: "200%",
                  background: `
                     conic-gradient(from ${
                       spiralRotation + 5
                     }deg at 52% 50%, transparent, cyan, transparent)
                  `,
                  mixBlendMode: "screen",
                  opacity: 0.3,
                  filter: "blur(8px)",
                }}
              />

              {/* Center Core Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, 
                    rgba(200, 240, 255, ${0.9 * glowPulse1}) 0%, 
                    rgba(0, 150, 255, 0.4) 40%,
                    transparent 70%)`,
                  filter: "blur(25px)",
                  mixBlendMode: "add",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
