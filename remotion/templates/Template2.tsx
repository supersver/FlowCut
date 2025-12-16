import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Img,
  Video,
  Audio,
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

interface Template2Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
  musicUrl?: string;
  musicVolume?: number;
}

export const Template2: React.FC<Template2Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
  customClips = [],
  musicUrl,
  musicVolume = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Check for active custom clip
  const activeClip = customClips.find(
    (clip) => frame >= clip.startFrame && frame < clip.endFrame
  );

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

  // Carousel logic with improved timing
  const imageDuration = 120; // 4 seconds per image
  const currentImageIndex =
    Math.floor(frame / imageDuration) % productImages.length;
  const frameInImage = frame % imageDuration;

  // Smooth zoom and fade for each image
  const imageScale = interpolate(
    frameInImage,
    [0, 30, 90, 120],
    [1.1, 1, 1, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const imageOpacity = interpolate(
    frameInImage,
    [0, 20, 100, 120],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ken Burns subtle movement
  const panX = interpolate(frameInImage, [0, 120], [-10, 10]);
  const panY = interpolate(frameInImage, [0, 120], [-5, 5]);

  // Animated gradient background
  const gradientRotate = frame * 0.5;

  // Review card animations (starts at frame 400)
  const reviewFrame = Math.max(0, frame - 400);
  const cardSpring = spring({
    frame: reviewFrame,
    fps,
    config: { damping: 15, stiffness: 90 },
  });

  // Stars bounce in one by one
  const getStarBounce = (index: number) => {
    const starFrame = Math.max(0, frame - 430 - index * 8);
    return spring({
      frame: starFrame,
      fps,
      config: { damping: 8, stiffness: 180 },
    });
  };

  // Glow animation
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 0.8]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotate}deg, #059669, #0D9488, #0891B2)`,
      }}
    >
      {/* Background Music */}
      {musicUrl && <Audio src={musicUrl} volume={musicVolume} loop />}

      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-300px",
          left: "-200px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          filter: "blur(80px)",
        }}
      />

      {/* Carousel - First 400 frames */}
      <Sequence from={0} durationInFrames={400}>
        <div
          style={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              position: "relative",
              opacity: imageOpacity,
              transform: `scale(${imageScale}) translate(${panX}px, ${panY}px)`,
            }}
          >
            {/* Image glow */}
            <div
              style={{
                position: "absolute",
                inset: "-30px",
                background: `rgba(255, 255, 255, ${glowPulse * 0.3})`,
                borderRadius: "48px",
                filter: "blur(40px)",
              }}
            />

            {/* Main image */}
            <Img
              src={productImages[currentImageIndex]}
              style={{
                width: "600px",
                height: "600px",
                borderRadius: "40px",
                objectFit: "cover",
                boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.5)",
                border: "6px solid rgba(255, 255, 255, 0.3)",
                position: "relative",
              }}
            />

            {/* Image counter */}
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "12px",
              }}
            >
              {productImages.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: idx === currentImageIndex ? "40px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    background:
                      idx === currentImageIndex
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Sequence>

      {/* Review Section - After 400 frames */}
      <Sequence from={400}>
        <div
          style={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "850px",
              background: "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(24px)",
              borderRadius: "48px",
              padding: "60px 70px",
              textAlign: "center",
              boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.35)",
              transform: `scale(${cardSpring}) translateY(${interpolate(
                cardSpring,
                [0, 1],
                [60, 0]
              )}px)`,
              opacity: cardSpring,
            }}
          >
            {/* Stars */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "36px",
              }}
            >
              {Array.from({ length: rating }).map((_, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "60px",
                    color: "#FBBF24",
                    display: "inline-block",
                    transform: `scale(${getStarBounce(idx)})`,
                    textShadow: "0 6px 20px rgba(251, 191, 36, 0.4)",
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote */}
            <p
              style={{
                fontSize: "44px",
                fontWeight: "600",
                fontStyle: "italic",
                color: "#1F2937",
                lineHeight: 1.4,
                marginBottom: "32px",
              }}
            >
              &ldquo;{reviewText}&rdquo;
            </p>

            {/* Author with verified badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "#6B7280",
                }}
              >
                — {reviewAuthor}
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
