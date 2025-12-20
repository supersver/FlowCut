import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

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

  const logoScale = interpolate(frame, [15, 35], [0.85, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // CTA button fade in (delayed)
  const ctaOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaSlideY = interpolate(frame, [35, 55], [30, 0], {
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
        padding: "48px",
      }}
    >
      {/* Logo or Brand Box */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: "48px",
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Brand Logo"
            style={{
              maxHeight: "140px",
              maxWidth: "320px",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              background: HDFC_BLUE,
              borderRadius: "20px",
              padding: "32px 56px",
              boxShadow: "0 12px 40px rgba(0, 76, 143, 0.35)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Red accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: HDFC_RED,
              }}
            />
            <div
              style={{
                color: "#ffffff",
                fontSize: "36px",
                fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
                letterSpacing: "1px",
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
            background: HDFC_RED,
            color: "#ffffff",
            padding: "22px 64px",
            borderRadius: "60px",
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 8px 30px rgba(231, 19, 26, 0.4)",
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
          opacity: ctaOpacity * 0.7,
          fontSize: "16px",
          color: "#5A6679",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
        }}
      >
        Powered by HDFC Bank
      </div>
    </div>
  );
};
