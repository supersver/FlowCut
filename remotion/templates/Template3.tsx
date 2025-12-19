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

interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

interface Template3Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
  musicTracks?: MusicTrack[];
}

export const Template3: React.FC<Template3Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
  customClips = [],
  musicTracks = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  // Product hero animations
  const heroScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const heroOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle parallax float
  const floatY = Math.sin(frame * 0.04) * 10;
  const floatRotate = Math.sin(frame * 0.025) * 1.5;

  // Shine effect moving across the image
  const shinePosition = interpolate(frame % 180, [0, 180], [-100, 200]);

  // Review section animations (starts at frame 380)
  const reviewFrame = Math.max(0, frame - 380);
  const slideSpring = spring({
    frame: reviewFrame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const slideUp = interpolate(slideSpring, [0, 1], [100, 0]);
  const reviewOpacity = interpolate(reviewFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stars animation
  const getStarAnimation = (index: number) => {
    const starFrame = Math.max(0, frame - 420 - index * 5);
    const scale = spring({
      frame: starFrame,
      fps,
      config: { damping: 10, stiffness: 200 },
    });
    const rotate = interpolate(starFrame, [0, 8], [-20, 0], {
      extrapolateRight: "clamp",
    });
    return { scale, rotate };
  };

  // Text reveal animation
  const textFrame = Math.max(0, frame - 450);
  const textOpacity = interpolate(textFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textSlide = interpolate(textFrame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Gradient animation
  const gradientShift = frame * 0.3;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${
          135 + gradientShift
        }deg, #EC4899, #F43F5E, #EF4444)`,
      }}
    >
      {/* Background Music Tracks - with proper timing */}
      {musicTracks.map((track) => (
        <Sequence
          key={track.id}
          from={track.startFrame}
          durationInFrames={track.endFrame - track.startFrame}
        >
          <Audio src={track.url} volume={track.volume} />
        </Sequence>
      ))}

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          filter: "blur(80px)",
        }}
      />

      {/* Product Hero - Top Section */}
      <Sequence from={0} durationInFrames={380}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "65%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              position: "relative",
              opacity: heroOpacity,
              transform: `scale(${heroScale}) translateY(${floatY}px) rotate(${floatRotate}deg)`,
            }}
          >
            {/* Glow behind product */}
            <div
              style={{
                position: "absolute",
                inset: "-40px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "50px",
                filter: "blur(50px)",
              }}
            />

            {/* Main product image */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "40px",
              }}
            >
              <Img
                src={productImages[0]}
                style={{
                  width: "auto",
                  height: "700px",
                  maxWidth: "700px",
                  objectFit: "cover",
                  borderRadius: "40px",
                  boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.4)",
                  border: "6px solid rgba(255, 255, 255, 0.25)",
                }}
              />

              {/* Shine effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${shinePosition}%`,
                  width: "60px",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                  transform: "skewX(-20deg)",
                }}
              />
            </div>

            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "-20px",
                background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                color: "#1F2937",
                fontSize: "24px",
                fontWeight: "700",
                padding: "16px 28px",
                borderRadius: "20px",
                boxShadow: "0 10px 30px -5px rgba(251, 191, 36, 0.5)",
                transform: `rotate(12deg) scale(${heroScale})`,
              }}
            >
              ⭐ Best Seller
            </div>
          </div>
        </div>
      </Sequence>

      {/* Review Section - Bottom Slide Up */}
      <Sequence from={380}>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "55%",
            transform: `translateY(${slideUp}%)`,
            opacity: reviewOpacity,
          }}
        >
          <div
            style={{
              height: "100%",
              background: "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(24px)",
              borderTopLeftRadius: "60px",
              borderTopRightRadius: "60px",
              padding: "50px 60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 -20px 60px -10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Stars */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "32px",
              }}
            >
              {Array.from({ length: rating }).map((_, idx) => {
                const { scale, rotate } = getStarAnimation(idx);
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: "58px",
                      color: "#FBBF24",
                      display: "inline-block",
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      textShadow: "0 5px 15px rgba(251, 191, 36, 0.4)",
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            {/* Review text */}
            <p
              style={{
                fontSize: "40px",
                fontWeight: "600",
                fontStyle: "italic",
                color: "#1F2937",
                textAlign: "center",
                lineHeight: 1.4,
                marginBottom: "28px",
                maxWidth: "850px",
                opacity: textOpacity,
                transform: `translateY(${textSlide}px)`,
              }}
            >
              &ldquo;{reviewText}&rdquo;
            </p>

            {/* Author */}
            <p
              style={{
                fontSize: "26px",
                fontWeight: "600",
                color: "#6B7280",
                opacity: textOpacity,
                transform: `translateY(${textSlide}px)`,
              }}
            >
              — {reviewAuthor}
            </p>

            {/* Decorative line */}
            <div
              style={{
                marginTop: "30px",
                width: "120px",
                height: "4px",
                background: "linear-gradient(90deg, #EC4899, #F43F5E)",
                borderRadius: "2px",
                opacity: textOpacity,
              }}
            />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
