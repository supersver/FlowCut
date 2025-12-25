import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

interface CreditCardProps {
  userName: string;
  cardNumber: string;
  limitUtilised: number;
  totalLimit: number;
  availableLimit: number;
  logoUrl?: string;
  // Global frame for persistent card animation
  globalFrame?: number;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  userName,
  cardNumber,
  limitUtilised,
  totalLimit,
  availableLimit,
  logoUrl,
  globalFrame,
}) => {
  const localFrame = useCurrentFrame();
  // Use global frame if provided (for persistent card), otherwise use local
  const frame = globalFrame !== undefined ? globalFrame : localFrame;

  // ============================================
  // ANIMATION PHASES (based on global timeline)
  // ============================================
  // Scene 2: Credit Card appears (90-240) - Card in center
  // Scene 3+: Card moves to bottom (240-270) - Transition animation
  // Scenes 3-5: Card stays at bottom (270-1110)
  // Scene 6: Card fades out (1110+)

  // Initial slide-in animation (frames 90-110 in global timeline)
  const introSlideY = interpolate(frame, [90, 110], [250, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const introOpacity = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const introScale = interpolate(frame, [90, 105, 110], [0.85, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar animation (frames 110-190)
  const progressWidth = interpolate(frame, [110, 190], [0, limitUtilised], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const displayPercentage = interpolate(frame, [110, 190], [0, limitUtilised], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ============================================
  // TRANSITION TO BOTTOM (frames 240-280)
  // ============================================
  // Position transition: center (75% from top) -> bottom (0)
  const topPosition = interpolate(
    frame,
    [240, 280],
    [75, 91], // 75% -> 100% (bottom anchored)
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Width transition: 92% -> 100%
  const cardWidth = interpolate(frame, [240, 280], [92, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Max width transition: 900px -> 100% (full width)
  const maxWidthValue = interpolate(frame, [240, 280], [900, 1200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Border radius transition: 28px -> 28px 28px 0 0
  const bottomRadius = interpolate(frame, [240, 280], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ============================================
  // FADE OUT before closing scene (frames 900-930)
  // ============================================
  const fadeOutOpacity = interpolate(frame, [900, 930], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combine opacities
  const finalOpacity = introOpacity * fadeOutOpacity;

  // Determine if card is in "bottom mode" (after transition)
  const isBottomMode = frame >= 280;

  const cardStyle: React.CSSProperties = isBottomMode
    ? {
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: `${cardWidth}%`,
        maxWidth: `${maxWidthValue}px`,
        zIndex: 100, // High z-index to stay above all scenes
        opacity: finalOpacity,
      }
    : {
        position: "absolute",
        top: `${topPosition}%`,
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${introSlideY}px) scale(${introScale})`,
        opacity: finalOpacity,
        zIndex: 110, // Higher in center mode
        width: `${cardWidth}%`,
        maxWidth: `${maxWidthValue}px`,
      };

  return (
    <div style={cardStyle}>
      <div
        style={{
          background: `linear-gradient(145deg, ${HDFC_BLUE} 0%, #003366 100%)`,
          borderRadius: isBottomMode
            ? "28px 28px 0 0"
            : `28px 28px ${bottomRadius}px ${bottomRadius}px`,
          padding: "36px",
          boxShadow: isBottomMode
            ? "0 -6px 30px rgba(0, 0, 0, 0.35)"
            : "0 24px 70px rgba(0, 76, 143, 0.5)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Red Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: HDFC_RED,
          }}
        />

        {/* Card Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            marginTop: "8px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontFamily: "'Roboto Mono', monospace",
                opacity: 0.85,
                marginTop: "6px",
                letterSpacing: "3px",
              }}
            >
              {cardNumber}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "13px",
                opacity: 0.8,
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Available Credit Limit
            </div>
            <div
              style={{ fontSize: "22px", fontWeight: 700, color: "#7CFC00" }}
            >
              ₹{availableLimit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
              fontSize: "16px",
              opacity: 0.95,
            }}
          >
            <span style={{ fontWeight: 500 }}>Limit Utilised</span>
            <span style={{ fontWeight: 800, fontSize: "22px" }}>
              {displayPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "12px",
              background: "rgba(255, 255, 255, 0.25)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressWidth}%`,
                height: "100%",
                background: `linear-gradient(90deg, #ffffff 0%, ${HDFC_LIGHT_BLUE} 100%)`,
                borderRadius: "6px",
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
            borderTop: "2px solid rgba(255, 255, 255, 0.25)",
            paddingTop: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                opacity: 0.8,
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Total Credit Limit
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700 }}>
              ₹{totalLimit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* VISA Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "28px",
            fontSize: "28px",
            fontWeight: 800,
            fontStyle: "italic",
            opacity: 0.95,
            letterSpacing: "2px",
          }}
        >
          VISA
        </div>
      </div>
    </div>
  );
};
