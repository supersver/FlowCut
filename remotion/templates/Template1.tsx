import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  Img,
  Video,
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

  // Original template content when no custom clip is active
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 60], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
        className="flex h-full flex-col items-center justify-center px-8 py-12"
      >
        {/* Product Images - Always visible */}
        <div className="mb-8 flex justify-center gap-6">
          {productImages.slice(0, 2).map((img, idx) => (
            <Img
              key={idx}
              src={img}
              className="h-72 w-72 rounded-3xl object-cover shadow-2xl"
            />
          ))}
        </div>

        {/* Review Card - Appears after 150 frames (5 seconds) */}
        <Sequence from={150}>
          <div className="mx-auto w-full max-w-xl rounded-3xl bg-white/95 px-10 py-8 shadow-2xl backdrop-blur">
            <div className="mb-4 flex justify-center gap-2">
              {Array.from({ length: rating }).map((_, idx) => (
                <span key={idx} className="text-5xl text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="mb-5 text-center text-2xl font-semibold italic text-gray-800">
              "{reviewText}"
            </p>
            <p className="text-center text-xl font-semibold text-gray-600">
            </p>
            <p className="text-center text-lg font-semibold text-gray-600">
              - {reviewAuthor}
            </p>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
