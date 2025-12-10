import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface Template1Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
}

export const Template1: React.FC<Template1Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const productScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const reviewOpacity = interpolate(frame, [300, 330], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-gradient-to-br from-purple-600 to-pink-500">
      {/* Product Images Section */}
      <AbsoluteFill className="items-center justify-center">
        <div
          style={{
            transform: `scale(${productScale})`,
            display: "flex",
            gap: "20px",
          }}
        >
          {productImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Product ${idx + 1}`}
              className="w-80 h-80 object-cover rounded-3xl shadow-2xl"
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* Review Section */}
      <AbsoluteFill
        className="items-center justify-end pb-32"
        style={{ opacity: reviewOpacity }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 mx-8 max-w-3xl">
          <div className="flex mb-4">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-3xl">
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-800 text-2xl mb-4 font-medium">
            "{reviewText}"
          </p>
          <p className="text-gray-600 text-xl">- {reviewAuthor}</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
