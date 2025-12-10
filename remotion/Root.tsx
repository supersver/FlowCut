import React from "react";
import { Composition } from "remotion";
import { Template1 } from "./templates/Template1";
import { Template2 } from "./templates/Template2";
import { Template3 } from "./templates/Template3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Template1"
        component={Template1}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          productImages: [
            "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Product+1",
            "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Product+2",
          ],
          reviewText: "Amazing product! Highly recommend!",
          reviewAuthor: "John Doe",
          rating: 5,
        }}
      />
      <Composition
        id="Template2"
        component={Template2}
        durationInFrames={600} // 20 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          productImages: [
            "https://via.placeholder.com/400x400/95E1D3/FFFFFF?text=Product+1",
            "https://via.placeholder.com/400x400/F38181/FFFFFF?text=Product+2",
            "https://via.placeholder.com/400x400/AA96DA/FFFFFF?text=Product+3",
          ],
          reviewText: "Best purchase ever!",
          reviewAuthor: "Jane Smith",
          rating: 5,
        }}
      />
      <Composition
        id="Template3"
        component={Template3}
        durationInFrames={750} // 25 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          productImages: [
            "https://via.placeholder.com/400x400/FCBAD3/FFFFFF?text=Product+1",
          ],
          reviewText: "Life changing product!",
          reviewAuthor: "Mike Johnson",
          rating: 5,
        }}
      />
    </>
  );
};
