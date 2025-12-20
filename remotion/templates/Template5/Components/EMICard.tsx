import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

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
  const scale = interpolate(frame, [0, 8, 15], [0.7, 1.05, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Backdrop blur animation
  const backdropOpacity = interpolate(frame, [0, 15], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Dark backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: backdropOpacity,
          zIndex: 55,
        }}
      />

      {/* EMI Card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          zIndex: 60,
          width: "88%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(145deg, #8B0000 0%, #5C0000 100%)",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "24px",
              paddingBottom: "20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "'Inter', sans-serif",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Smart Finance Option
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Convert to EMI
            </div>
          </div>

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
                [20, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <div
                  key={transaction.name}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    marginBottom: "12px",
                    opacity: itemOpacity,
                    transform: `translateX(${itemSlideX}px)`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#ffffff",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {transaction.name}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
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
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        fontSize: "12px",
                        color: "#90EE90",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {transaction.emiMonths} EMI
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "rgba(255, 255, 255, 0.85)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ₹{transaction.emiAmount.toLocaleString("en-IN")}/month
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#ffffff",
                color: "#8B0000",
                padding: "14px 36px",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              Choose EMI Plan
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
