import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface Template3Props {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
}

export const Template3: React.FC<Template3Props> = ({
  productImages,
  reviewText,
  reviewAuthor,
  rating,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const productY = spring({
    frame: frame - 60,
    fps,
    config: { damping: 100 },
  });

  const translateY = interpolate(productY, [0, 1], [1000, 0]);

  const reviewScale = spring({
    frame: frame - 400,
    fps,
    config: { damping: 100, stiffness: 200 },
  });

  return (
    <AbsoluteFill className="bg-gradient-to-b from-orange-400 via-red-500 to-pink-600">
      {/* Split Screen Layout */}
      <AbsoluteFill>
        {/* Product Section */}
        <div
          className="absolute top-0 left-0 right-0 h-2/3 flex items-center justify-center"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          <div className="relative">
            {productImages[0] && (
              <img
                src={productImages[0]}
                alt="Product"
                className="w-[600px] h-[600px] object-cover rounded-2xl shadow-2xl"
              />
            )}
          </div>
        </div>

        {/* Review Section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 flex items-center justify-center p-8"
          style={{ transform: `scale(${reviewScale})` }}
        >
          <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-10 w-full max-w-5xl">
            <div className="flex mb-4">
              {[...Array(rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-4xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-white text-3xl mb-4 font-bold">"{reviewText}"</p>
            <p className="text-gray-300 text-2xl">- {reviewAuthor}</p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
