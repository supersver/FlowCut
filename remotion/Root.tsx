import React from "react";
import { Composition, registerRoot, staticFile } from "remotion";
import { Template1 } from "./templates/Template1";
import { Template2 } from "./templates/Template2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="template1"
        component={Template1 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          recipientName: "Mayank",
          phoneName: "Vivo X300",
          presenterVideoUrl: staticFile("presenter-video.mp4"),
          productImageUrl: "",
          logoUrl: "",
          customClips: [],
          musicTracks: [],
          captions: [],
          captionSettings: {
            fontSize: 48,
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "bottom",
          },
          usePhoneTease: true,
          sceneTimings: [],
        }}
      />
      <Composition
        id="template2"
        component={Template2 as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          recipientName: "Jayant",
          presenterVideoUrl: staticFile("template-5-presenter-video.mp4"),
          logoUrl: staticFile("bank logo.png"),
          musicTracks: [],
          customClips: [],
          captions: [],
          captionSettings: {
            fontSize: 48,
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "bottom",
          },
          userName: "Jayant Bhakhri",
          cardNumber: "•••• •••• •••• 6959",
          limitUtilised: 49,
          totalLimit: 500000,
          availableLimit: 255000,
          brandText: "SMART BANK OF INDIA",
          ctaText: "Choose your EMI plan",
          sceneTimings: [],
        }}
      />
    </>
  );
};

// Register the root component for Remotion bundler
registerRoot(RemotionRoot);
