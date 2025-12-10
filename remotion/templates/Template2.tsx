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

interface Template2Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
}

export const Template2: React.FC<Template2Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
  customClips = [],
}) => {
  const frame = useCurrentFrame();

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

  // Original carousel template
  const currentImageIndex = Math.floor(frame / 150) % productImages.length;
  const imageOpacity = interpolate(
    frame % 150,
    [0, 30, 120, 150],
    [0, 1, 1, 0]
  );

  return (
    <AbsoluteFill className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
      {/* Carousel - First 450 frames (15 seconds) */}
      <Sequence from={0} durationInFrames={450}>
        <div className="flex h-full items-center justify-center">
          <div
            style={{ opacity: imageOpacity }}
            className="flex items-center justify-center"
          >
            <Img
              src={productImages[currentImageIndex]}
              className="h-[500px] w-[500px] rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </Sequence>

      {/* Review Section - After 450 frames */}
      <Sequence from={450}>
        <div className="flex h-full items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg rounded-3xl bg-white/95 px-10 py-12 text-center shadow-2xl backdrop-blur">
            <div className="mb-6 flex justify-center gap-2">
              {Array.from({ length: rating }).map((_, idx) => (
                <span key={idx} className="text-5xl text-yellow-400">
                  ★
                </span>
              ))}
            </div>
            <p className="mb-8 text-2xl font-semibold italic text-gray-800">
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
