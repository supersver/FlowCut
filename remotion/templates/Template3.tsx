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

interface Template3Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
}

export const Template3: React.FC<Template3Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
  customClips = [],
}) => {
  const frame = useCurrentFrame();

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

  const slideUp = interpolate(frame, [0, 60], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500">
      {/* Product Hero - Top 60% */}
      <Sequence from={0} durationInFrames={450}>
        <div className="flex h-[60%] items-center justify-center p-10">
          <Img
            src={productImages[0]}
            className="h-full max-h-[600px] w-auto max-w-full rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </Sequence>

      {/* Review Bottom - Bottom 40% with slide up animation */}
      <Sequence from={450}>
        <div
          style={{ transform: `translateY(${slideUp}%)` }}
          className="absolute bottom-0 left-0 right-0 flex h-1/2 items-center justify-center bg-white/95 p-8"
        >
          <div className="flex max-w-md flex-col items-center justify-center text-center">
            <div className="mb-6 flex gap-2">
              {Array.from({ length: rating }).map((_, idx) => (
                <span key={idx} className="text-5xl text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="mb-6 text-2xl font-semibold italic text-gray-800">
              "{reviewText}"
            </p>
            <p className="text-xl font-semibold text-gray-600">
              - {reviewAuthor}
            </p>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
