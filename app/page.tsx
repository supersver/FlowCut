"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Template1 } from "@/remotion/templates/Template1";
import { Template2 } from "@/remotion/templates/Template2";
import { Template3 } from "@/remotion/templates/Template3";
import { Template4 } from "@/remotion/templates/Template4";
import { Template5 } from "@/remotion/templates/Template5";
import { Timeline } from "./components/Timeline";
import {
  parseSrt,
  CaptionItem,
  CaptionSettings,
  DEFAULT_CAPTION_SETTINGS,
} from "@/lib/parseSrt";

const ASPECT_RATIOS = [
  { id: "9:16", name: "Portrait (9:16)", width: 1080, height: 1920 },
  { id: "16:9", name: "Landscape (16:9)", width: 1920, height: 1080 },
  { id: "1:1", name: "Square (1:1)", width: 1080, height: 1080 },
  { id: "4:5", name: "Instagram (4:5)", width: 1080, height: 1350 },
];

const FPS_OPTIONS = [
  { id: 24, name: "24 fps", description: "Cinematic" },
  { id: 30, name: "30 fps", description: "Standard" },
  { id: 60, name: "60 fps", description: "Smooth" },
];

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
}

interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

// Shared props interface for all templates
interface TemplateProps {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
}

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
}

const templates: TemplateConfig[] = [
  {
    id: "template1",
    name: "Modern Slide",
    description: "Showcase multiple products with a clean review card.",
    duration: 450,
    component: Template1,
  },
  {
    id: "template2",
    name: "Carousel",
    description: "Fade between products, then highlight a review.",
    duration: 600,
    component: Template2,
  },
  {
    id: "template3",
    name: "Split Screen",
    description: "Hero product at the top with a bold review section.",
    duration: 750,
    component: Template3,
  },
  {
    id: "template4",
    name: "WhatsApp Pre-Launch",
    description:
      "Personalized presenter video with phone tease & WhatsApp CTA.",
    duration: 750,
    component: Template4,
  },
  {
    id: "template5",
    name: "HDFC Financial Services",
    description:
      "Credit card with spending analytics, merchant breakdown & EMI options.",
    duration: 1200,
    component: Template5,
  },
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [productImages, setProductImages] = useState([
    "https://placehold.co/400",
  ]);
  const [reviewText, setReviewText] = useState(
    "Amazing product! Highly recommend!"
  );
  const [reviewAuthor, setReviewAuthor] = useState("John Doe");
  const [rating, setRating] = useState(5);
  const [customClips, setCustomClips] = useState<CustomClip[]>([]);
  // Template4 specific props
  const [recipientName, setRecipientName] = useState("Mayank");
  const [phoneName, setPhoneName] = useState("Vivo X300");
  const [presenterVideoUrl, setPresenterVideoUrl] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  // Caption settings for Template4
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [captionSettings, setCaptionSettings] = useState<CaptionSettings>(
    DEFAULT_CAPTION_SETTINGS
  );
  const [usePhoneTease, setUsePhoneTease] = useState(true);
  // Template5 specific props
  const [t5UserName, setT5UserName] = useState("Jayant Bhakhri");
  const [t5CardNumber, setT5CardNumber] = useState("•••• •••• •••• 4832");
  const [t5LimitUtilised, setT5LimitUtilised] = useState(49);
  const [t5TotalLimit, setT5TotalLimit] = useState(500000);
  const [t5AvailableLimit, setT5AvailableLimit] = useState(255000);
  const [t5BrandText, setT5BrandText] = useState("SMART BANK OF INDIA");
  const [t5CtaText, setT5CtaText] = useState("Choose your EMI plan");
  // Music tracks (supports multiple)
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [fps, setFps] = useState(FPS_OPTIONS[1]); // Default to 30 fps
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Track when component is mounted on client to avoid SSR issues with Remotion Player
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync current frame from player
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFrameUpdate = () => {
      setCurrentFrame(player.getCurrentFrame());
    };

    player.addEventListener("frameupdate", handleFrameUpdate);
    return () => {
      player.removeEventListener("frameupdate", handleFrameUpdate);
    };
  }, [isMounted]);

  // Seek handler for timeline
  const handleSeek = useCallback((frame: number) => {
    console.log(
      "handleSeek called with frame:",
      frame,
      "playerRef.current:",
      playerRef.current
    );
    playerRef.current?.seekTo(frame);
  }, []);

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const base64Promises = Array.from(files).map((file) =>
        fileToBase64(file)
      );
      const base64Urls = await Promise.all(base64Promises);
      setProductImages(base64Urls);
    }
  };

  const handlePresenterVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToBase64(file);
      setPresenterVideoUrl(url);
    }
  };

  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToBase64(file);
      setProductImageUrl(url);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToBase64(file);
      setLogoUrl(url);
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileToBase64(file);
      const newTrack: MusicTrack = {
        id: `music-${Date.now()}-${Math.random()}`,
        url,
        startFrame: 0,
        endFrame: selectedTemplate.duration,
        volume: 0.5,
      };
      setMusicTracks((prev) => [...prev, newTrack]);
    }
  };

  const updateMusicTrack = (
    id: string,
    updates: Partial<Omit<MusicTrack, "id" | "url">>
  ) => {
    setMusicTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, ...updates } : track))
    );
  };

  const removeMusicTrack = (id: string) => {
    setMusicTracks((prev) => prev.filter((track) => track.id !== id));
  };

  const handleCustomClipUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        const url = await fileToBase64(file);
        const type = file.type.startsWith("video/") ? "video" : "image";
        const newClip: CustomClip = {
          id: `clip-${Date.now()}-${Math.random()}`,
          url,
          startFrame: 210,
          endFrame: 330,
          type,
        };
        setCustomClips((prev) => [...prev, newClip]);
      }
    }
  };

  const updateClipTiming = (
    id: string,
    startFrame: number,
    endFrame: number
  ) => {
    setCustomClips((prev) =>
      prev.map((clip) =>
        clip.id === id ? { ...clip, startFrame, endFrame } : clip
      )
    );
  };

  const removeClip = (id: string) => {
    setCustomClips((prev) => prev.filter((clip) => clip.id !== id));
  };

  // SRT file upload handler
  const handleSrtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const parsedCaptions = parseSrt(text, fps.id);
      setCaptions(parsedCaptions);
    }
  };

  // Update individual caption timing
  const updateCaptionTiming = (
    id: string,
    startFrame: number,
    endFrame: number
  ) => {
    setCaptions((prev) =>
      prev.map((caption) =>
        caption.id === id ? { ...caption, startFrame, endFrame } : caption
      )
    );
  };

  // Update caption text
  const updateCaptionText = (id: string, text: string) => {
    setCaptions((prev) =>
      prev.map((caption) =>
        caption.id === id ? { ...caption, text } : caption
      )
    );
  };

  // Remove caption
  const removeCaption = (id: string) => {
    setCaptions((prev) => prev.filter((caption) => caption.id !== id));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(5);
      console.log("Starting export...");

      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          duration: selectedTemplate.duration,
          width: aspectRatio.width,
          height: aspectRatio.height,
          fps: fps.id,
          props:
            selectedTemplate.id === "template4"
              ? {
                  recipientName,
                  phoneName,
                  presenterVideoUrl,
                  productImageUrl,
                  logoUrl,
                  customClips,
                  musicTracks,
                  captions,
                  captionSettings,
                  usePhoneTease,
                }
              : selectedTemplate.id === "template5"
              ? {
                  recipientName,
                  presenterVideoUrl,
                  logoUrl,
                  musicTracks,
                  captions,
                  captionSettings,
                  userName: t5UserName,
                  cardNumber: t5CardNumber,
                  limitUtilised: t5LimitUtilised,
                  totalLimit: t5TotalLimit,
                  availableLimit: t5AvailableLimit,
                  brandText: t5BrandText,
                  ctaText: t5CtaText,
                }
              : {
                  productImages,
                  reviewText,
                  reviewAuthor,
                  rating,
                  customClips,
                  musicTracks,
                },
        }),
      });

      const contentType = response.headers.get("content-type");
      console.log(
        "Response status:",
        response.status,
        "Content-type:",
        contentType
      );

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response wasn't JSON
        }
        throw new Error(errorMessage);
      }

      if (contentType?.includes("video/mp4")) {
        setExportProgress(90);
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Received empty video file");
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flowcut-video-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setExportProgress(100);
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 2000);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Server returned unexpected response");
      }
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Export failed: ${errorMessage}`);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden">
      {/* Top Toolbar */}
      <header className="flex-shrink-0 h-12 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
            <span className="text-[10px] font-bold">FC</span>
          </div>
          <span className="text-sm font-medium">FlowCut Studio</span>
          <span className="text-xs text-slate-500 hidden sm:inline">|</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {selectedTemplate.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <select
              value={aspectRatio.id}
              onChange={(e) =>
                setAspectRatio(
                  ASPECT_RATIOS.find((r) => r.id === e.target.value) ||
                    ASPECT_RATIOS[0]
                )
              }
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
            >
              {ASPECT_RATIOS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}
                </option>
              ))}
            </select>
            <select
              value={fps.id}
              onChange={(e) =>
                setFps(
                  FPS_OPTIONS.find((f) => f.id === Number(e.target.value)) ||
                    FPS_OPTIONS[1]
                )
              }
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs"
            >
              {FPS_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id} fps
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition ${
              isExporting
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:brightness-110"
            }`}
          >
            {isExporting ? (
              <>
                <svg
                  className="h-3 w-3 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {exportProgress}%
              </>
            ) : (
              <>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </>
            )}
          </button>
        </div>
      </header>

      {isExporting && (
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Templates & Media */}
        <aside className="w-72 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Templates
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full rounded-lg p-2.5 text-left text-xs transition ${
                  selectedTemplate.id === template.id
                    ? "bg-blue-500/20 border border-blue-500/50"
                    : "bg-slate-800/50 border border-transparent hover:bg-slate-800"
                }`}
              >
                <div className="font-medium text-slate-100">
                  {template.name}
                </div>
                <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">
                  {template.description}
                </p>
              </button>
            ))}
          </div>

          {/* Media Section */}
          {selectedTemplate.id !== "template4" && (
            <div className="border-t border-slate-800">
              <div className="p-3 border-b border-slate-800">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Media
                </h3>
              </div>
              <div className="p-2">
                <label className="block">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-3 cursor-pointer hover:border-slate-600">
                    <span className="text-[10px] text-slate-400">
                      + Add Images
                    </span>
                  </div>
                </label>
                {productImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {productImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="h-12 w-full rounded object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Clips */}
          <div className="border-t border-slate-800">
            <div className="p-3 border-b border-slate-800">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Custom Clips
              </h3>
            </div>
            <div className="p-2">
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleCustomClipUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-3 cursor-pointer hover:border-slate-600">
                  <span className="text-[10px] text-slate-400">
                    + Add Clips
                  </span>
                </div>
              </label>
              {customClips.length > 0 && (
                <div className="mt-2 space-y-1">
                  {customClips.map((clip, i) => (
                    <div
                      key={clip.id}
                      className="flex items-center justify-between rounded bg-slate-800/50 px-2 py-1.5"
                    >
                      <span className="text-[10px] text-slate-300">
                        Clip {i + 1}
                      </span>
                      <button
                        onClick={() => removeClip(clip.id)}
                        className="text-[10px] text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 min-w-0">
          <div
            ref={playerContainerRef}
            className="relative rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl"
            style={{
              width:
                aspectRatio.id === "16:9"
                  ? "100%"
                  : aspectRatio.id === "1:1"
                  ? "min(100%, 400px)"
                  : "min(100%, 320px)",
              maxWidth: "100%",
              aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
            }}
          >
            {isMounted ? (
              <Player
                ref={playerRef}
                component={
                  selectedTemplate.component as unknown as React.FC<
                    Record<string, unknown>
                  >
                }
                durationInFrames={selectedTemplate.duration}
                compositionWidth={aspectRatio.width}
                compositionHeight={aspectRatio.height}
                acknowledgeRemotionLicense
                fps={fps.id}
                inputProps={
                  selectedTemplate.id === "template4"
                    ? {
                        recipientName,
                        phoneName,
                        presenterVideoUrl,
                        productImageUrl,
                        logoUrl,
                        customClips,
                        musicTracks,
                        captions,
                        captionSettings,
                        usePhoneTease,
                      }
                    : selectedTemplate.id === "template5"
                    ? {
                        recipientName,
                        presenterVideoUrl,
                        logoUrl,
                        musicTracks,
                        captions,
                        captionSettings,
                        userName: t5UserName,
                        cardNumber: t5CardNumber,
                        limitUtilised: t5LimitUtilised,
                        totalLimit: t5TotalLimit,
                        availableLimit: t5AvailableLimit,
                        brandText: t5BrandText,
                        ctaText: t5CtaText,
                      }
                    : {
                        productImages,
                        reviewText,
                        reviewAuthor,
                        rating,
                        customClips,
                        musicTracks,
                      }
                }
                style={{ width: "100%", height: "100%" }}
                controls
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                Loading...
              </div>
            )}
          </div>
          {/* <div className="mt-3 text-center text-xs text-slate-500">
            {selectedTemplate.name} •{" "}
            {(selectedTemplate.duration / fps.id).toFixed(1)}s
          </div> */}
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Properties
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {selectedTemplate.id === "template4" ? (
              <>
                {/* Template4 Properties */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    placeholder="e.g. Mayank"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Phone Name
                  </label>
                  <input
                    type="text"
                    value={phoneName}
                    onChange={(e) => setPhoneName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    placeholder="e.g. Vivo X300"
                  />
                </div>

                {/* Presenter Video */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Presenter Video
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handlePresenterVideoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {presenterVideoUrl ? "✓ Video loaded" : "+ Upload video"}
                    </div>
                  </label>
                  {presenterVideoUrl && (
                    <button
                      onClick={() => setPresenterVideoUrl("")}
                      className="mt-1 text-[10px] text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Product Image
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {productImageUrl ? "✓ Image loaded" : "+ Upload image"}
                    </div>
                  </label>
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Brand Logo
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {logoUrl ? "✓ Logo loaded" : "+ Upload logo"}
                    </div>
                  </label>
                </div>

                {/* PhoneTease Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePhoneTease}
                    onChange={(e) => setUsePhoneTease(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-800"
                  />
                  <span className="text-xs text-slate-300">
                    Use PhoneTease animation
                  </span>
                </label>

                {/* Captions Section */}
                <div className="border-t border-slate-800 pt-3">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    📝 Captions (SRT)
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept=".srt"
                      onChange={handleSrtUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {captions.length > 0
                        ? `${captions.length} captions`
                        : "+ Upload SRT"}
                    </div>
                  </label>
                  {captions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Font
                          </label>
                          <select
                            value={captionSettings.fontFamily}
                            onChange={(e) =>
                              setCaptionSettings((s) => ({
                                ...s,
                                fontFamily: e.target.value,
                              }))
                            }
                            className="w-full rounded border border-slate-700 bg-slate-800 px-1.5 py-1 text-[10px] text-slate-100"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Arial">Arial</option>
                            <option value="Georgia">Georgia</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Position
                          </label>
                          <select
                            value={captionSettings.position}
                            onChange={(e) =>
                              setCaptionSettings((s) => ({
                                ...s,
                                position: e.target.value as
                                  | "top"
                                  | "center"
                                  | "bottom",
                              }))
                            }
                            className="w-full rounded border border-slate-700 bg-slate-800 px-1.5 py-1 text-[10px] text-slate-100"
                          >
                            <option value="bottom">Bottom</option>
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Color
                          </label>
                          <input
                            type="color"
                            value={captionSettings.color}
                            onChange={(e) =>
                              setCaptionSettings((s) => ({
                                ...s,
                                color: e.target.value,
                              }))
                            }
                            className="w-full h-6 rounded border border-slate-700 bg-slate-800 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-500 mb-0.5">
                            Size
                          </label>
                          <input
                            type="number"
                            min="20"
                            max="80"
                            value={captionSettings.fontSize}
                            onChange={(e) =>
                              setCaptionSettings((s) => ({
                                ...s,
                                fontSize: parseInt(e.target.value) || 44,
                              }))
                            }
                            className="w-full rounded border border-slate-700 bg-slate-800 px-1.5 py-1 text-[10px] text-slate-100"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setCaptions([])}
                        className="text-[10px] text-red-400"
                      >
                        Clear captions
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : selectedTemplate.id === "template5" ? (
              <>
                {/* Template5 Properties */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    placeholder="e.g. Jayant"
                  />
                </div>

                {/* Presenter Video */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Presenter Video
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handlePresenterVideoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {presenterVideoUrl ? "✓ Video loaded" : "+ Upload video"}
                    </div>
                  </label>
                  {presenterVideoUrl && (
                    <button
                      onClick={() => setPresenterVideoUrl("")}
                      className="mt-1 text-[10px] text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Brand Logo
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {logoUrl ? "✓ Logo loaded" : "+ Upload logo"}
                    </div>
                  </label>
                </div>

                {/* Credit Card Settings */}
                <div className="border-t border-slate-700 pt-3">
                  <h4 className="text-[11px] font-medium text-slate-300 mb-2">
                    Credit Card Settings
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={t5UserName}
                        onChange={(e) => setT5UserName(e.target.value)}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Card Number (masked)
                      </label>
                      <input
                        type="text"
                        value={t5CardNumber}
                        onChange={(e) => setT5CardNumber(e.target.value)}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Limit Used (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={t5LimitUtilised}
                          onChange={(e) =>
                            setT5LimitUtilised(parseInt(e.target.value) || 0)
                          }
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Total Limit (₹)
                        </label>
                        <input
                          type="number"
                          value={t5TotalLimit}
                          onChange={(e) =>
                            setT5TotalLimit(parseInt(e.target.value) || 0)
                          }
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Available Limit (₹)
                      </label>
                      <input
                        type="number"
                        value={t5AvailableLimit}
                        onChange={(e) =>
                          setT5AvailableLimit(parseInt(e.target.value) || 0)
                        }
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Settings */}
                <div className="border-t border-slate-700 pt-3">
                  <h4 className="text-[11px] font-medium text-slate-300 mb-2">
                    Closing CTA
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        Brand Text
                      </label>
                      <input
                        type="text"
                        value={t5BrandText}
                        onChange={(e) => setT5BrandText(e.target.value)}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={t5CtaText}
                        onChange={(e) => setT5CtaText(e.target.value)}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Music tracks */}
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Background Music
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleMusicUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      + Add music track
                    </div>
                  </label>
                  {musicTracks.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {musicTracks.map((track, i) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between rounded bg-slate-800/50 px-2 py-1.5"
                        >
                          <span className="text-[10px] text-slate-300">
                            Track {i + 1}
                          </span>
                          <button
                            onClick={() => removeMusicTrack(track.id)}
                            className="text-[10px] text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Captions */}
                <div className="border-t border-slate-700 pt-3">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Captions (SRT)
                  </label>
                  <label className="block">
                    <input
                      type="file"
                      accept=".srt"
                      onChange={handleSrtUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
                      {captions.length > 0
                        ? `✓ ${captions.length} captions`
                        : "+ Upload SRT file"}
                    </div>
                  </label>
                  {captions.length > 0 && (
                    <button
                      onClick={() => setCaptions([])}
                      className="mt-1 text-[10px] text-red-400"
                    >
                      Clear captions
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Other Templates Properties */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Review Text
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-100 focus:border-blue-500 outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-100 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Rating: {rating}★
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Timeline */}
      <div className="flex-shrink-0 border-t border-slate-800 bg-slate-900/80">
        <Timeline
          currentFrame={currentFrame}
          durationInFrames={selectedTemplate.duration}
          fps={fps.id}
          customClips={customClips}
          onSeek={handleSeek}
          onClipUpdate={updateClipTiming}
          musicTracks={musicTracks}
          onMusicUpload={handleMusicUpload}
          onMusicTrackUpdate={updateMusicTrack}
          onMusicTrackRemove={removeMusicTrack}
        />
      </div>
    </div>
  );
}
