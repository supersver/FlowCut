import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface CreditCardProps {
  userName: string;
  cardNumber: string;
  limitUtilised: number;
  totalLimit: number;
  availableLimit: number;
  logoUrl?: string;
  isFooter?: boolean;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  userName,
  cardNumber,
  limitUtilised,
  totalLimit,
  availableLimit,
  logoUrl,
  isFooter = false,
}) => {
  const frame = useCurrentFrame();

  // Animation timing for main card (scene starts at frame 0 relative)
  // Slide in from below: 0-20 frames
  // Progress bar fills: 20-100 frames

  const slideInY = interpolate(frame, [0, 20], [200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Progress bar animation
  const progressWidth = interpolate(frame, [20, 100], [0, limitUtilised], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Counter animation
  const displayPercentage = interpolate(frame, [20, 100], [0, limitUtilised], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale for pop effect
  const scale = interpolate(frame, [0, 15, 20], [0.9, 1.02, 1], {
    extrapolateRight: "clamp",
  });

  const cardStyle: React.CSSProperties = isFooter
    ? {
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "400px",
        zIndex: 40,
      }
    : {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${slideInY}px) scale(${scale})`,
        opacity,
        zIndex: 50,
        width: "85%",
        maxWidth: "380px",
      };

  return (
    <div style={cardStyle}>
      <div
        style={{
          background: "linear-gradient(145deg, #8B0000 0%, #5C0000 100%)",
          borderRadius: isFooter ? "20px 20px 0 0" : "20px",
          padding: "28px",
          boxShadow: isFooter
            ? "0 -4px 20px rgba(0, 0, 0, 0.3)"
            : "0 20px 60px rgba(139, 0, 0, 0.4)",
          color: "#ffffff",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontFamily: "'Roboto Mono', monospace",
                opacity: 0.8,
                marginTop: "4px",
                letterSpacing: "2px",
              }}
            >
              {cardNumber}
            </div>
          </div>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Bank Logo"
              style={{
                height: "36px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </div>

        {/* Progress Section */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "12px",
              opacity: 0.9,
            }}
          >
            <span>Limit Utilised</span>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>
              {displayPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressWidth}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)",
                borderRadius: "4px",
                transition: "width 0.1s ease-out",
              }}
            />
          </div>
        </div>

        {/* Limits Display */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "16px",
          }}
        >
          <div>
            <div
              style={{ fontSize: "10px", opacity: 0.7, marginBottom: "4px" }}
            >
              Total Credit Limit
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              ₹{totalLimit.toLocaleString("en-IN")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: "10px", opacity: 0.7, marginBottom: "4px" }}
            >
              Available Credit Limit
            </div>
            <div
              style={{ fontSize: "16px", fontWeight: 600, color: "#90EE90" }}
            >
              ₹{availableLimit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* VISA Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "20px",
            fontSize: "22px",
            fontWeight: 700,
            fontStyle: "italic",
            opacity: 0.9,
            letterSpacing: "1px",
          }}
        >
          VISA
        </div>
      </div>
    </div>
  );
};
