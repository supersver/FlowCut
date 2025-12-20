import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

interface EMITransaction {
  name: string;
  amount: number;
  emiMonths: number;
  emiAmount: number;
}

interface EMICardProps {
  transactions: EMITransaction[];
}

export const EMICard: React.FC<EMICardProps> = ({ transactions }) => {
  const frame = useCurrentFrame();

  // Pop-in animation
  const scaleIn = interpolate(frame, [0, 8, 15], [0.65, 1.05, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  // Fade out animation (scene is 150 frames, fade out last 20 frames)
  const scaleOut = interpolate(frame, [130, 150], [1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  // Combine animations
  const scale = frame < 130 ? scaleIn : scaleIn * scaleOut;
  const opacity =
    interpolate(frame, [0, 10], [0, 1], {
      extrapolateRight: "clamp",
    }) * fadeOut;

  const translateY = interpolate(frame, [130, 150], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* EMI Card */}
      <div
        style={{
          position: "absolute",
          bottom: "13%",
          left: "50%",
          transform: `translate(-50%, calc(-30% + ${translateY}px)) scale(${scale})`,
          opacity,
          zIndex: 60,
          width: "92%",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            background: `linear-gradient(145deg, ${HDFC_BLUE} 0%, #003366 100%)`,
            borderRadius: "28px",
            padding: "36px",
            boxShadow: "0 30px 100px rgba(0, 0, 0, 0.6)",
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

          {/* Transaction List */}
          <div>
            {transactions.map((transaction, index) => {
              // Staggered fade-in for each item
              const itemDelay = 20 + index * 10;
              const itemOpacity = interpolate(
                frame,
                [itemDelay, itemDelay + 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const itemSlideX = interpolate(
                frame,
                [itemDelay, itemDelay + 15],
                [25, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <div
                  key={transaction.name}
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "18px",
                    padding: "22px 24px",
                    marginBottom: "14px",
                    opacity: itemOpacity,
                    transform: `translateX(${itemSlideX}px)`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#ffffff",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {transaction.name}
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        color: "#ffffff",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        background: HDFC_RED,
                        borderRadius: "8px",
                        padding: "8px 14px",
                        fontSize: "14px",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {transaction.emiMonths} EMI
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "rgba(255, 255, 255, 0.9)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      ₹{transaction.emiAmount.toLocaleString("en-IN")}/month
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
