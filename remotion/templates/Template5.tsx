import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
  OffthreadVideo,
  Audio,
} from "remotion";
import { GreetingBanner } from "./Template5/Components/GreetingBanner";
import { CreditCard } from "./Template5/Components/CreditCard";
import { SpendingCategories } from "./Template5/Components/SpendingCategories";
import { MerchantList } from "./Template5/Components/MerchantList";
import { EMICard } from "./Template5/Components/EMICard";
import { ClosingCTA } from "./Template5/Components/ClosingCTA";

interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

interface CaptionItem {
  id: string;
  startFrame: number;
  endFrame: number;
  text: string;
}

interface CaptionSettings {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: "top" | "center" | "bottom";
}

interface Category {
  name: string;
  percentage: number;
  amount: number;
  icon: string;
}

interface Merchant {
  name: string;
  logo?: string;
  count: number;
  total: number;
}

interface EMITransaction {
  name: string;
  amount: number;
  emiMonths: number;
  emiAmount: number;
}

interface Template5Props {
  // Reused from Template 4
  recipientName: string;
  presenterVideoUrl?: string;
  logoUrl?: string;
  musicTracks?: MusicTrack[];
  captions?: CaptionItem[];
  captionSettings?: CaptionSettings;

  // Template 5 specific
  userName?: string;
  cardNumber?: string;
  limitUtilised?: number;
  totalLimit?: number;
  availableLimit?: number;
  categories?: Category[];
  merchants?: Merchant[];
  emiTransactions?: EMITransaction[];
  brandText?: string;
  ctaText?: string;
}

// Default data for preview
const DEFAULT_CATEGORIES: Category[] = [
  { name: "Dining", percentage: 40, amount: 12500, icon: "🍽️" },
  { name: "Travel", percentage: 30, amount: 9500, icon: "✈️" },
  { name: "Electronics", percentage: 20, amount: 6200, icon: "📱" },
  { name: "Shopping", percentage: 10, amount: 3100, icon: "🛍️" },
];

const DEFAULT_MERCHANTS: Merchant[] = [
  { name: "Vivanta Hotels", count: 3, total: 45000 },
  { name: "MakeMyTrip", count: 5, total: 32000 },
  { name: "Shoppers Stop", count: 8, total: 18500 },
  { name: "Amazon", count: 12, total: 15200 },
  { name: "Swiggy", count: 25, total: 8500 },
];

const DEFAULT_EMI_TRANSACTIONS: EMITransaction[] = [
  { name: "Vivanta Hotels", amount: 45000, emiMonths: 6, emiAmount: 7500 },
  { name: 'MakeMyTrip"', amount: 32000, emiMonths: 12, emiAmount: 2666 },
  { name: "Shoppers Stop", amount: 18500, emiMonths: 6, emiAmount: 3083 },
];

export const Template5: React.FC<Template5Props> = ({
  recipientName,
  presenterVideoUrl,
  logoUrl,
  musicTracks = [],
  captions: captionsProp,
  captionSettings: captionSettingsProp,
  userName = "Jayant Bhakhri",
  cardNumber = "•••• •••• •••• 6959",
  limitUtilised = 49,
  totalLimit = 500000,
  availableLimit = 255000,
  categories = DEFAULT_CATEGORIES,
  merchants = DEFAULT_MERCHANTS,
  emiTransactions = DEFAULT_EMI_TRANSACTIONS,
  brandText = "HDFC BANK PVT. LTD.",
  ctaText = "Choose your EMI plan",
}) => {
  const frame = useCurrentFrame();

  // ============================================
  // SCENE TIMING (at 30fps) - 35 second video
  // ============================================
  // Scene 1: Intro + Greeting Banner    | 0-90 frames (0-3s)
  // Scene 2: Credit Card                | 90-240 frames (3-8s)
  // Scene 3: Spending Categories        | 240-480 frames (8-16s)
  // Scene 4: Merchant List              | 480-630 frames (16-21s)
  // Scene 5: EMI Card                   | 630-780 frames (21-26s)
  // (Presenter only)                    | 780-930 frames (26-31s)
  // Scene 6: Closing CTA                | 930-1050 frames (31-35s)
  // Total: 1050 frames (35s)

  // Presenter video visibility
  // Show during intro, credit card, EMI card, presenter-only, and closing
  // Hide during app interface (Spending Categories & Merchant List: 240-630)
  const presenterOpacity = interpolate(
    frame,
    [0, 90, 240, 260, 600, 630],
    [1, 1, 1, 0.0001, 0.0001, 1],
    { extrapolateRight: "clamp" }
  );

  // ============================================
  // CAPTIONS LOGIC (copied from Template 4)
  // ============================================
  const defaultCaptions: CaptionItem[] = [];

  const captions =
    captionsProp && captionsProp.length > 0 ? captionsProp : defaultCaptions;

  const captionSettings: CaptionSettings = {
    fontFamily: captionSettingsProp?.fontFamily || "Inter",
    fontSize: captionSettingsProp?.fontSize || 44,
    color: captionSettingsProp?.color || "#ffffff",
    backgroundColor:
      captionSettingsProp?.backgroundColor || "rgba(0, 0, 0, 0.7)",
    position: captionSettingsProp?.position || "bottom",
  };

  const currentCaption = captions.find(
    (cap) => frame >= cap.startFrame && frame < cap.endFrame
  );

  const getCaptionOpacity = () => {
    if (!currentCaption) return 0;
    const fadeInEnd = currentCaption.startFrame + 5;
    const fadeOutStart = currentCaption.endFrame - 5;

    if (frame < fadeInEnd) {
      return interpolate(
        frame,
        [currentCaption.startFrame, fadeInEnd],
        [0, 1],
        { extrapolateRight: "clamp" }
      );
    }
    if (frame > fadeOutStart) {
      return interpolate(
        frame,
        [fadeOutStart, currentCaption.endFrame],
        [1, 0],
        { extrapolateRight: "clamp" }
      );
    }
    return 1;
  };

  return (
    <AbsoluteFill style={{ background: "#0a0a15" }}>
      {/* Background Music Tracks */}
      {musicTracks.map((track) => (
        <Sequence
          key={track.id}
          from={track.startFrame}
          durationInFrames={track.endFrame - track.startFrame}
        >
          <Audio src={track.url} volume={track.volume} />
        </Sequence>
      ))}

      {/* ============================================ */}
      {/* GLOBAL LAYERS */}
      {/* ============================================ */}

      {/* Logo on top-right */}
      {logoUrl && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            zIndex: 100,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          {/* <div
            style={{
              padding: "12px 16px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          > */}
          <img
            src={logoUrl}
            alt="Logo"
            style={{
              height: "90px",
              width: "auto",
              maxWidth: "250px",
              objectFit: "contain",
            }}
          />
          {/* </div> */}
        </div>
      )}

      {/* Global Presenter Video Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: presenterOpacity,
        }}
      >
        {presenterVideoUrl ? (
          <OffthreadVideo
            src={presenterVideoUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            volume={1}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "#2a2a4e",
              }}
            />
          </div>
        )}
      </div>

      {/* Gradient overlay for presenter */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
          zIndex: 1,
          opacity: presenterOpacity,
        }}
      />

      {/* ============================================ */}
      {/* SCENES */}
      {/* ============================================ */}

      {/* Scene 1: Intro + Greeting Banner (0-90 frames) */}
      <Sequence from={0} durationInFrames={90} style={{ zIndex: 10 }}>
        <GreetingBanner recipientName={recipientName} />
      </Sequence>

      {/* PERSISTENT CREDIT CARD (90-930 frames) */}
      {/* Appears at frame 90, transitions to bottom at 240, fades out at 930 */}
      {frame >= 90 && frame < 930 && (
        <CreditCard
          userName={userName}
          cardNumber={cardNumber}
          limitUtilised={limitUtilised}
          totalLimit={totalLimit}
          availableLimit={availableLimit}
          logoUrl={logoUrl}
          globalFrame={frame}
        />
      )}

      {/* Scene 3: Spending Categories (240-480 frames = 8s to 16s) */}
      <Sequence from={240} durationInFrames={240} style={{ zIndex: 30 }}>
        <SpendingCategories categories={categories} activeTab="category" />
      </Sequence>

      {/* Scene 4: Merchant List (480-630 frames = 16s to 21s) */}
      <Sequence from={480} durationInFrames={150} style={{ zIndex: 40 }}>
        <MerchantList merchants={merchants} />
      </Sequence>

      {/* Scene 5: EMI Card (630-780 frames = 21s to 26s) */}
      <Sequence from={630} durationInFrames={150} style={{ zIndex: 50 }}>
        <EMICard transactions={emiTransactions} />
      </Sequence>

      {/* Scene 6: Closing CTA (930-1050 frames = 31s to 35s) */}
      <Sequence from={930} durationInFrames={120} style={{ zIndex: 60 }}>
        <ClosingCTA logoUrl={logoUrl} brandText={brandText} ctaText={ctaText} />
      </Sequence>

      {/* ============================================ */}
      {/* CAPTIONS OVERLAY */}
      {/* ============================================ */}
      {currentCaption && (
        <div
          style={{
            position: "absolute",
            bottom: captionSettings.position === "bottom" ? "100px" : undefined,
            top: captionSettings.position === "top" ? "100px" : undefined,
            left: "50%",
            transform:
              captionSettings.position === "center"
                ? "translate(-50%, -50%)"
                : "translateX(-50%)",
            zIndex: 200,
            opacity: getCaptionOpacity(),
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: captionSettings.backgroundColor,
              padding: "16px 32px",
              borderRadius: "12px",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                color: captionSettings.color,
                fontSize: `${captionSettings.fontSize}px`,
                fontWeight: 600,
                fontFamily: `'${captionSettings.fontFamily}', 'Segoe UI', sans-serif`,
                lineHeight: 1.4,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {currentCaption.text}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
