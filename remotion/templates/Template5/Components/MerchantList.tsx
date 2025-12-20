import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

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
        background: "#F5F7FA",
        opacity,
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: HDFC_BLUE,
          padding: "28px 32px",
          paddingTop: "60px",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 700,
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
          borderBottom: "2px solid #E8E8E8",
        }}
      >
        {["Transactions", "Category", "Merchants"].map((tab) => {
          const isActive = tab === "Merchants";
          return (
            <div
              key={tab}
              style={{
                flex: 1,
                padding: "20px",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? HDFC_BLUE : "#5A6679",
                borderBottom: isActive
                  ? `4px solid ${HDFC_RED}`
                  : "4px solid transparent",
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
          padding: "24px",
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
            [25, 0],
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
                borderRadius: "20px",
                padding: "24px 28px",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: `2px solid ${HDFC_LIGHT_BLUE}`,
                opacity: cardOpacity,
                transform: `translateY(${cardSlideY}px)`,
              }}
            >
              {/* Merchant Logo/Initial */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: merchant.logo ? "#ffffff" : HDFC_BLUE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "20px",
                  overflow: "hidden",
                  border: merchant.logo
                    ? `2px solid ${HDFC_LIGHT_BLUE}`
                    : "none",
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
                      fontSize: "28px",
                      fontWeight: 800,
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
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#111928",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {merchant.name}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#5A6679",
                    marginTop: "6px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {merchant.count} transaction{merchant.count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Amount */}
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: HDFC_BLUE,
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
