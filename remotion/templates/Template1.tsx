import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Img,
  Video,
  spring,
  useVideoConfig,
} from "remotion";

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
}

interface Template1Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
}

export const Template1: React.FC<Template1Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
  customClips = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Check if current frame should show a custom clip
  const activeClip = customClips.find(
    (clip) => frame >= clip.startFrame && frame < clip.endFrame
  );

  // If there's an active custom clip, render it
  if (activeClip) {
    const clipFrame = frame - activeClip.startFrame;
    const clipDuration = activeClip.endFrame - activeClip.startFrame;
    const fadeInOut = interpolate(
      clipFrame,
      [0, 15, clipDuration - 15, clipDuration],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
      <AbsoluteFill className="bg-black">
        {activeClip.type === "video" ? (
          <AbsoluteFill>
            <Video
              src={activeClip.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: fadeInOut,
              }}
              volume={0}
              playbackRate={1}
            />
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ opacity: fadeInOut }}>
            <Img
              src={activeClip.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    );
  }

  // Spring animations for smooth entrance
  const imageScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const imageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating animation for product images
  const floatY = Math.sin(frame * 0.05) * 8;
  const floatRotate = Math.sin(frame * 0.03) * 2;

  // Glow pulse animation
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.7]
  );

  // Card entrance animation (starts at frame 120)
  const cardFrame = Math.max(0, frame - 120);
  const cardSpring = spring({
    frame: cardFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const cardSlideUp = interpolate(cardSpring, [0, 1], [200, 0]);
  const cardOpacity = interpolate(cardFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stars animation (staggered entrance)
  const getStarAnimation = (index: number) => {
    const starFrame = Math.max(0, frame - 150 - index * 6);
    const starScale = spring({
      frame: starFrame,
      fps,
      config: { damping: 8, stiffness: 200 },
    });
    const starRotate = interpolate(starFrame, [0, 10], [180, 0], {
      extrapolateRight: "clamp",
    });
    return { scale: starScale, rotate: starRotate };
  };

  return (
    <AbsoluteFill className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 20%, rgba(139, 92, 246, ${glowIntensity}) 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, rgba(236, 72, 153, ${glowIntensity}) 0%, transparent 50%)`,
        }}
      />

      {/* Product Images Section - Centered at top */}
      <div
        style={{
          opacity: imageOpacity,
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: `translateX(-50%) scale(${imageScale}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {productImages.slice(0, 2).map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              transform: `rotate(${idx === 0 ? -3 : 3}deg)`,
            }}
          >
            {/* Glow effect behind image */}
            <div
              style={{
                position: "absolute",
                inset: "-20px",
                background: `linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))`,
                borderRadius: "40px",
                filter: "blur(30px)",
                opacity: glowIntensity,
              }}
            />
            <Img
              src={img}
              style={{
                width: "380px",
                height: "380px",
                borderRadius: "32px",
                objectFit: "cover",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                border: "4px solid rgba(255, 255, 255, 0.2)",
                position: "relative",
              }}
            />
          </div>
        ))}
      </div>

      {/* Review Card - Positioned at bottom */}
      <Sequence from={120}>
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: `translateX(-50%) translateY(${cardSlideUp}px)`,
            opacity: cardOpacity,
            width: "90%",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "40px",
              padding: "50px 60px",
              boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Stars with staggered animation */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "30px",
              }}
            >
              {Array.from({ length: rating }).map((_, idx) => {
                const { scale, rotate } = getStarAnimation(idx);
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: "56px",
                      color: "#FBBF24",
                      display: "inline-block",
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      textShadow: "0 4px 15px rgba(251, 191, 36, 0.5)",
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            {/* Review Text */}
            <p
              style={{
                textAlign: "center",
                fontSize: "42px",
                fontWeight: "600",
                fontStyle: "italic",
                color: "#1F2937",
                lineHeight: 1.4,
                marginBottom: "24px",
              }}
            >
              &ldquo;{reviewText}&rdquo;
            </p>

            {/* Author */}
            <p
              style={{
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "600",
                color: "#6B7280",
              }}
            >
              — {reviewAuthor}
            </p>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
