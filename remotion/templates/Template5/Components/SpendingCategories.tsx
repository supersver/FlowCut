import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// HDFC Bank Brand Colors
const HDFC_BLUE = "#004C8F";
const HDFC_RED = "#E7131A";
const HDFC_LIGHT_BLUE = "#E1EEFA";

interface Category {
  name: string;
  percentage: number;
  amount: number;
  icon: string;
}

interface SpendingCategoriesProps {
  categories: Category[];
  activeTab?: "transactions" | "category" | "merchants";
}

// SVG Donut Chart Component
const DonutChart: React.FC<{ percentage: number; delay: number }> = ({
  percentage,
  delay,
}) => {
  const frame = useCurrentFrame();

  const circumference = 2 * Math.PI * 36; // radius = 36 (larger)
  const animatedPercentage = interpolate(
    frame,
    [delay, delay + 40],
    [0, percentage],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {/* Background circle */}
      <circle
        cx="45"
        cy="45"
        r="36"
        fill="none"
        stroke={HDFC_LIGHT_BLUE}
        strokeWidth="8"
      />
      {/* Progress circle */}
      <circle
        cx="45"
        cy="45"
        r="36"
        fill="none"
        stroke={HDFC_BLUE}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
      />
      {/* Center text */}
      <text
        x="45"
        y="50"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#111928"
        fontFamily="Inter, sans-serif"
      >
        {Math.round(animatedPercentage)}%
      </text>
    </svg>
  );
};

export const SpendingCategories: React.FC<SpendingCategoriesProps> = ({
  categories,
  activeTab = "category",
}) => {
  const frame = useCurrentFrame();

  // Interface slide up animation
  const slideY = interpolate(frame, [0, 25], [900, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F5F7FA",
        transform: `translateY(${slideY}px)`,
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
          Spending Analysis
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
          const isActive = tab.toLowerCase() === activeTab;
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

      {/* Category Cards */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
        }}
      >
        {categories.map((category, index) => {
          // Staggered animation for each card
          const cardDelay = 20 + index * 8;
          const cardOpacity = interpolate(
            frame,
            [cardDelay, cardDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const cardSlideX = interpolate(
            frame,
            [cardDelay, cardDelay + 15],
            [60, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <div
              key={category.name}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: `2px solid ${HDFC_LIGHT_BLUE}`,
                opacity: cardOpacity,
                transform: `translateX(${cardSlideX}px)`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: HDFC_LIGHT_BLUE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  marginRight: "24px",
                }}
              >
                {category.icon}
              </div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#111928",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {category.name}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 800,
                    color: HDFC_BLUE,
                    marginTop: "6px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  ₹{category.amount.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Donut Chart */}
              <DonutChart
                percentage={category.percentage}
                delay={cardDelay + 10}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
