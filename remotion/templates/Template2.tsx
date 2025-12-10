import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface Template2Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
}

export const Template2: React.FC<Template2Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600">
      {/* Product Carousel */}
      {productImages.map((img, idx) => {
        const startFrame = idx * 150;
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 30, startFrame + 120, startFrame + 150],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={150}>
            <AbsoluteFill
              className="items-center justify-center"
              style={{ opacity }}
            >
              <img
                src={img}
                alt={`Product ${idx + 1}`}
                className="w-[500px] h-[500px] object-cover rounded-full shadow-2xl border-8 border-white"
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Review Section */}
      <Sequence from={450}>
        <AbsoluteFill className="items-center justify-center">
          <div className="bg-white/95 rounded-3xl p-12 mx-8 max-w-4xl text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              {[...Array(rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-4xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-800 text-3xl mb-6 font-semibold italic">
              "{reviewText}"
            </p>
            <p className="text-gray-600 text-2xl font-medium">
              - {reviewAuthor}
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
