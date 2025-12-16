import React from "react";
import { Composition, registerRoot } from "remotion";
import { Template1 } from "./templates/Template1";
import { Template2 } from "./templates/Template2";
import { Template3 } from "./templates/Template3";
import { Template4 } from "./templates/Template4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="template1"
        component={Template1 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          productImages: [
            "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Product+1",
          ],
          reviewText: "Amazing product! Highly recommend!",
          reviewAuthor: "John Doe",
          rating: 5,
          customClips: [],
        }}
      />
      <Composition
        id="template2"
        component={Template2 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          productImages: [
            "https://via.placeholder.com/400x400/95E1D3/FFFFFF?text=Product+1",
          ],
          reviewText: "Best purchase ever!",
          reviewAuthor: "Jane Smith",
          rating: 5,
          customClips: [],
        }}
      />
      <Composition
        id="template3"
        component={Template3 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={750}
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
          customClips: [],
        }}
      />
      <Composition
        id="template4"
        component={Template4 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          recipientName: "Mayank",
          phoneName: "Vivo X200",
          presenterVideoUrl: "",
          customClips: [],
        }}
      />
    </>
  );
};

// Register the root component for Remotion bundler
registerRoot(RemotionRoot);
