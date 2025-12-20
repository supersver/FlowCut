import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

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

  const circumference = 2 * Math.PI * 28; // radius = 28
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
    <svg width="70" height="70" viewBox="0 0 70 70">
      {/* Background circle */}
      <circle
        cx="35"
        cy="35"
        r="28"
        fill="none"
        stroke="#E8E8E8"
        strokeWidth="6"
      />
      {/* Progress circle */}
      <circle
        cx="35"
        cy="35"
        r="28"
        fill="none"
        stroke="#8B0000"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 35 35)"
        style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
      />
      {/* Center text */}
      <text
        x="35"
        y="38"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#1a1a2e"
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
  const slideY = interpolate(frame, [0, 25], [800, 0], {
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
        background: "#F5F5F5",
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
          Spending Analysis
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
          const isActive = tab.toLowerCase() === activeTab;
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

      {/* Category Cards */}
      <div
        style={{
          flex: 1,
          padding: "16px",
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
            [50, 0],
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
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                opacity: cardOpacity,
                transform: `translateX(${cardSlideX}px)`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#FFF5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginRight: "16px",
                }}
              >
                {category.icon}
              </div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {category.name}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#8B0000",
                    marginTop: "4px",
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
