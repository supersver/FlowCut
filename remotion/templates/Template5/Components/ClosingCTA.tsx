import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface ClosingCTAProps {
  logoUrl?: string;
  brandText: string;
  ctaText: string;
}

export const ClosingCTA: React.FC<ClosingCTAProps> = ({
  logoUrl,
  brandText,
  ctaText,
}) => {
  const frame = useCurrentFrame();

  // Background fade to white
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo/Brand text fade in
  const logoOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoScale = interpolate(frame, [15, 35], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button fade in (delayed)
  const ctaOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaSlideY = interpolate(frame, [35, 55], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#ffffff",
        opacity: bgOpacity,
        zIndex: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      {/* Logo or Brand Box */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: "40px",
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Brand Logo"
            style={{
              maxHeight: "120px",
              maxWidth: "280px",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              background: "#8B0000",
              borderRadius: "16px",
              padding: "24px 40px",
              boxShadow: "0 8px 30px rgba(139, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
                letterSpacing: "0.5px",
              }}
            >
              {brandText}
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaSlideY}px)`,
        }}
      >
        <div
          style={{
            background: "#8B0000",
            color: "#ffffff",
            padding: "18px 48px",
            borderRadius: "50px",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 6px 25px rgba(139, 0, 0, 0.35)",
            cursor: "pointer",
          }}
        >
          {ctaText}
        </div>
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          opacity: ctaOpacity * 0.6,
          fontSize: "12px",
          color: "#666666",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Powered by Smart Banking
      </div>
    </div>
  );
};
