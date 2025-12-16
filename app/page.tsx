"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Template1 } from "@/remotion/templates/Template1";
import { Template2 } from "@/remotion/templates/Template2";
import { Template3 } from "@/remotion/templates/Template3";
import { Timeline } from "./components/Timeline";

const ASPECT_RATIOS = [
  { id: "9:16", name: "Portrait (9:16)", width: 1080, height: 1920 },
  { id: "16:9", name: "Landscape (16:9)", width: 1920, height: 1080 },
  { id: "1:1", name: "Square (1:1)", width: 1080, height: 1080 },
  { id: "4:5", name: "Instagram (4:5)", width: 1080, height: 1350 },
];

const templates = [
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
];

interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
}

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
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<PlayerRef>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

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
  }, [selectedTemplate]);

  // Seek handler for timeline
  const handleSeek = useCallback((frame: number) => {
    playerRef.current?.seekTo(frame);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setProductImages(urls);
    }
  };

  const handleCustomClipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("video/") ? "video" : "image";
        const newClip: CustomClip = {
          id: `clip-${Date.now()}-${Math.random()}`,
          url,
          startFrame: 210,
          endFrame: 330,
          type,
        };
        setCustomClips((prev) => [...prev, newClip]);
      });
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
          props: {
            productImages,
            reviewText,
            reviewAuthor,
            rating,
            customClips,
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
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-transparent blur-3xl" />
      <div className="relative z-10">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/40">
                <span className="text-xs font-semibold tracking-wider">FC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  FlowCut Studio
                </h1>
                <p className="text-xs text-slate-400">
                  Generate product review videos in seconds
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
              <span className="rounded-full bg-slate-900 px-3 py-1">
                {aspectRatio.width} × {aspectRatio.height} • 30 fps
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1">
                Templates: {templates.length}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Create a product video
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Choose a template, drop in your product images, and customize
                the review content. The preview updates in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Auto-animated
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Preview Section */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/60">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-slate-100">
                    Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live playback of the selected template with your content.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-lg transition ${
                    isExporting
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-violet-500 shadow-blue-500/40 hover:brightness-110"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Exporting {exportProgress}%
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
                      Export Video
                    </>
                  )}
                </button>
              </div>

              {isExporting && (
                <div className="mb-4 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              )}

              <div
                className="relative mx-auto"
                style={{
                  maxWidth:
                    aspectRatio.id === "16:9"
                      ? "100%"
                      : aspectRatio.id === "1:1"
                      ? "380px"
                      : "320px",
                }}
              >
                <div
                  ref={playerContainerRef}
                  style={{
                    aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}`,
                  }}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-black"
                >
                  <Player
                    ref={playerRef}
                    component={selectedTemplate.component}
                    durationInFrames={selectedTemplate.duration}
                    compositionWidth={aspectRatio.width}
                    compositionHeight={aspectRatio.height}
                    acknowledgeRemotionLicense
                    fps={30}
                    inputProps={{
                      productImages,
                      reviewText,
                      reviewAuthor,
                      rating,
                      customClips,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    controls
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {selectedTemplate.name} • {selectedTemplate.duration / 30}s
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1">
                  Rating: {rating}★
                </span>
              </div>

              {/* Timeline */}
              <div className="mt-5">
                <Timeline
                  currentFrame={currentFrame}
                  durationInFrames={selectedTemplate.duration}
                  fps={30}
                  customClips={customClips}
                  onSeek={handleSeek}
                  onClipUpdate={updateClipTiming}
                />
              </div>

              {/* Aspect Ratio Selection */}
              <div className="rounded-2xl border mt-5 border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  Select aspect ratio
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Choose the video dimensions for your platform.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                        aspectRatio.id === ratio.id
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-medium text-slate-100">
                        {ratio.id}
                      </div>
                      <p className="mt-0.5 text-slate-400">
                        {ratio.width}×{ratio.height}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Controls Section */}
            <section className="space-y-5">
              {/* Template Selection */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  1. Choose a template
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Select a layout for your product video.
                </p>
                <div className="mt-3 space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                        selectedTemplate.id === template.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-medium text-slate-100">
                        {template.name}
                      </div>
                      <p className="mt-0.5 text-slate-400">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Images Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  2. Upload product images
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Add up to 5 product images for the video.
                </p>
                <div className="mt-3">
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-700 px-3 py-6 text-center hover:border-slate-600">
                      <div>
                        <svg
                          className="mx-auto h-5 w-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="mt-1 text-xs text-slate-400">
                          Click to upload images
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                {productImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {productImages?.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Product"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Clips Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  2b. Add custom clips (optional)
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Layer video or image clips on top of the template.
                </p>
                <div className="mt-3">
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleCustomClipUpload}
                      className="hidden"
                    />
                    <div className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-700 px-3 py-4 text-center hover:border-slate-600">
                      <div>
                        <svg
                          className="mx-auto h-5 w-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="mt-1 text-xs text-slate-400">
                          Click to upload clips
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="mt-3 space-y-3">
                  {customClips.map((clip, idx) => (
                    <div
                      key={clip.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">
                            {clip.type === "video" ? "🎥 Video" : "🖼️ Image"}
                          </span>
                          <span className="text-xs font-medium text-slate-100">
                            Clip #{idx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeClip(clip.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-400">
                            Start time (seconds)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={selectedTemplate.duration / 30}
                            step="0.1"
                            value={(clip.startFrame / 30).toFixed(1)}
                            onChange={(e) => {
                              const seconds = parseFloat(e.target.value);
                              updateClipTiming(
                                clip.id,
                                Math.round(seconds * 30),
                                clip.endFrame
                              );
                            }}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none ring-0 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-slate-400">
                            End time (seconds)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={selectedTemplate.duration / 30}
                            step="0.1"
                            value={(clip.endFrame / 30).toFixed(1)}
                            onChange={(e) => {
                              const seconds = parseFloat(e.target.value);
                              updateClipTiming(
                                clip.id,
                                clip.startFrame,
                                Math.round(seconds * 30)
                              );
                            }}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none ring-0 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                        <span>
                          Duration:{" "}
                          {((clip.endFrame - clip.startFrame) / 30).toFixed(1)}s
                        </span>
                        <span>•</span>
                        <span>
                          Frames: {clip.startFrame}→{clip.endFrame}
                        </span>
                      </div>

                      <div className="mt-2 overflow-hidden rounded-lg border border-slate-800">
                        {clip.type === "image" ? (
                          <img
                            src={clip.url}
                            alt="Clip preview"
                            className="h-20 w-full object-cover"
                          />
                        ) : (
                          <video
                            src={clip.url}
                            className="h-20 w-full object-cover"
                            muted
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {customClips.length === 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-4 text-center text-xs text-slate-500">
                      No custom clips added. Templates will play normally.
                    </div>
                  )}
                </div>
              </div>

              {/* Review Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  3. Customize review
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Control the review text, author and rating stars.
                </p>

                <div className="mt-4 space-y-4 text-xs">
                  <div>
                    <label className="mb-1.5 block font-medium text-slate-200">
                      Review text
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                      rows={3}
                      placeholder="Share what customers love about this product..."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                    <div>
                      <label className="mb-1.5 block font-medium text-slate-200">
                        Author name
                      </label>
                      <input
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                        placeholder="e.g. Sarah M."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-medium text-slate-200">
                        Rating
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                        <div className="flex min-w-[3.5rem] flex-col items-end text-[11px] text-slate-200">
                          <span className="font-semibold">{rating}.0</span>
                          <span className="text-yellow-400">
                            {"★".repeat(rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
