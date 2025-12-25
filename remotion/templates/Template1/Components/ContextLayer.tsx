import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

// Inline SVG Icons (Kept thin and clean)
const CalendarIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <rect x="7" y="14" width="2" height="2" fill="currentColor"></rect>
    <rect x="11" y="14" width="2" height="2" fill="currentColor"></rect>
    <rect x="15" y="14" width="2" height="2" fill="currentColor"></rect>
  </svg>
);

const MessageIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const GridIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
    <path d="M10 10h4v4h-4z" fill="currentColor" opacity="0.5"></path>{" "}
    {/* QR Code hint */}
  </svg>
);

const FEATURE_CARDS = [
  {
    icon: <CalendarIcon />,
    label: "Work Calls",
    delay: 0,
  },
  {
    icon: <MessageIcon />,
    label: "Messages",
    delay: 8,
  },
  {
    icon: <GridIcon />,
    label: "A bunch of apps",
    delay: 16,
  },
];

interface FeatureCardProps {
  icon: React.ReactNode;
  label: string;
  delay: number;
  frame: number;
  fps: number;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  label,
  delay,
  frame,
  fps,
  index,
}) => {
  const adjustedFrame = Math.max(0, frame - delay);

  const cardSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const translateY = interpolate(cardSpring, [0, 1], [50, 0]);
  const scale = interpolate(cardSpring, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        marginBottom: "40px",
        marginRight: "30px",
        position: "relative",
      }}
    >
      {/* Card Body */}
      <div
        style={{
          width: "420px",
          height: "420px", // Square styling like control center
          background:
            "linear-gradient(180deg, rgba(235, 240, 245, 0.7) 0%, rgba(220, 230, 240, 0.5) 100%)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "60px",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.1),
            inset 0 0 0 2px rgba(255, 255, 255, 0.5)
          `,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {/* Icon Container (White Squircle) */}
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "40px",
            background: "rgba(255,255,255, 0.5)", // Lighter internal container
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1a1a1a", // Dark icon
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {icon}
        </div>

        {/* Label */}
        <span
          style={{
            fontSize: "36px",
            fontWeight: "500",
            color: "#1a1a1a",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export const ContextLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitOpacity = interpolate(frame, [100, 120], [1, 0]);

  // Entrance for the sidebar itself
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 20 },
  });
  const sidebarX = interpolate(slideIn, [0, 1], [100, 0]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: exitOpacity }}>
      {/* Right-Side Glass Pane/Rail */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "45%", // Takes up right side
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.0) 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.2) 100%)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          transform: `translateX(${sidebarX}%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "40px",
        }}
      >
        {FEATURE_CARDS.map((card, idx) => (
          <FeatureCard
            key={idx}
            icon={card.icon}
            label={card.label}
            delay={card.delay}
            frame={frame}
            fps={fps}
            index={idx}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
