import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface Merchant {
  name: string;
  logo?: string;
  count: number;
  total: number;
}

interface MerchantListProps {
  merchants: Merchant[];
}

export const MerchantList: React.FC<MerchantListProps> = ({ merchants }) => {
  const frame = useCurrentFrame();

  // Quick fade transition
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F5F5F5",
        opacity,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#8B0000",
          padding: "20px 24px",
          paddingTop: "50px",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            margin: 0,
          }}
        >
          Your Merchants
        </h2>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          background: "#ffffff",
          borderBottom: "1px solid #E8E8E8",
        }}
      >
        {["Transactions", "Category", "Merchants"].map((tab) => {
          const isActive = tab === "Merchants";
          return (
            <div
              key={tab}
              style={{
                flex: 1,
                padding: "16px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#8B0000" : "#666666",
                borderBottom: isActive
                  ? "3px solid #8B0000"
                  : "3px solid transparent",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {/* Merchant Cards */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
        }}
      >
        {merchants.map((merchant, index) => {
          // Staggered animation
          const cardDelay = 10 + index * 6;
          const cardOpacity = interpolate(
            frame,
            [cardDelay, cardDelay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cardSlideY = interpolate(
            frame,
            [cardDelay, cardDelay + 12],
            [20, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <div
              key={merchant.name}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "18px 20px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                opacity: cardOpacity,
                transform: `translateY(${cardSlideY}px)`,
              }}
            >
              {/* Merchant Logo/Initial */}
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: merchant.logo ? "#ffffff" : "#8B0000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  overflow: "hidden",
                  border: merchant.logo ? "1px solid #E8E8E8" : "none",
                }}
              >
                {merchant.logo ? (
                  <img
                    src={merchant.logo}
                    alt={merchant.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "20px",
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {merchant.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Merchant Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {merchant.name}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666666",
                    marginTop: "4px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {merchant.count} transaction{merchant.count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Amount */}
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#8B0000",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                ₹{merchant.total.toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
