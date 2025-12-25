"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { PlayerRef } from "@remotion/player";
import { Timeline } from "./components/Timeline";
import { SceneElementSelectorModal } from "./components/SceneElementSelectorModal";
import { SceneElement } from "./constants/SCENE_ELEMENTS";
import { Header } from "./components/Header";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/RightPanel";
import { VideoPreview } from "./components/VideoPreview";
import { CaptionEditorModal } from "./components/CaptionEditorModal";
import {
  parseSrt,
  CaptionItem,
  CaptionSettings,
  DEFAULT_CAPTION_SETTINGS,
} from "@/lib/parseSrt";
import {
  CustomClip,
  MusicTrack,
  SceneDefinition,
  AspectRatio,
  FpsOption,
  TemplateConfig,
} from "@/app/types";
import {
  ASPECT_RATIOS,
  FPS_OPTIONS,
  DEFAULT_SCENES,
  templates,
} from "@/app/constants/editorConfig";

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(
    templates[0]
  );
  const [productImages, setProductImages] = useState([
    "https://placehold.co/400",
  ]);
  const [reviewText, setReviewText] = useState(
    "Amazing product! Highly recommend!"
  );
  const [reviewAuthor, setReviewAuthor] = useState("John Doe");
  const [rating, setRating] = useState(5);
  const [customClips, setCustomClips] = useState<CustomClip[]>([]);
  // Template1 specific props
  const [recipientName, setRecipientName] = useState("Mayank");
  const [phoneName, setPhoneName] = useState("Vivo X300");
  const [presenterVideoUrl, setPresenterVideoUrl] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  // Caption settings
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [captionSettings, setCaptionSettings] = useState<CaptionSettings>(
    DEFAULT_CAPTION_SETTINGS
  );
  const [usePhoneTease, setUsePhoneTease] = useState(true);
  // Template2 specific props
  const [t5UserName, setT5UserName] = useState("Jayant Bhakhri");
  const [t5CardNumber, setT5CardNumber] = useState("•••• •••• •••• 6959");
  const [t5LimitUtilised, setT5LimitUtilised] = useState(49);
  const [t5TotalLimit, setT5TotalLimit] = useState(500000);
  const [t5AvailableLimit, setT5AvailableLimit] = useState(255000);
  const [t5BrandText, setT5BrandText] = useState("SMART BANK OF INDIA");
  const [t5CtaText, setT5CtaText] = useState("Choose your EMI plan");
  // Music tracks (supports multiple)
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  // Scene timings (editable)
  const [scenes, setScenes] = useState<SceneDefinition[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [fps, setFps] = useState<FpsOption>(FPS_OPTIONS[1]); // Default to 30 fps
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [captionEditorOpen, setCaptionEditorOpen] = useState(false);
  const [elementSelectorOpen, setElementSelectorOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef<PlayerRef>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Track when component is mounted on client to avoid SSR issues with Remotion Player
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize scenes when template changes
  useEffect(() => {
    setScenes(DEFAULT_SCENES[selectedTemplate.id] || []);
  }, [selectedTemplate.id]);

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
          layer: 1, // Default to overlay layer
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

  const updateClipLayer = (id: string, layer: number) => {
    setCustomClips((prev) =>
      prev.map((clip) => (clip.id === id ? { ...clip, layer } : clip))
    );
  };

  // Scene update handlers
  const updateScene = useCallback(
    (id: string, startFrame: number, endFrame: number) => {
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === id ? { ...scene, startFrame, endFrame } : scene
        )
      );
    },
    []
  );

  const updateSceneProperties = useCallback(
    (id: string, updates: Partial<SceneDefinition>) => {
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === id ? { ...scene, ...updates } : scene
        )
      );
    },
    []
  );

  const addScene = useCallback((scene: SceneDefinition) => {
    setScenes((prev) => [...prev, scene]);
  }, []);

  const removeScene = useCallback((id: string) => {
    setScenes((prev) => prev.filter((scene) => scene.id !== id));
  }, []);

  // Handler for selecting a scene element from the modal
  const handleElementSelect = useCallback(
    (element: SceneElement) => {
      const lastScene = scenes[scenes.length - 1];
      const newStartFrame = lastScene ? lastScene.endFrame : 0;
      const newId = `scene-${Date.now()}`;

      addScene({
        id: newId,
        name: element.name,
        startFrame: newStartFrame,
        endFrame: Math.min(
          newStartFrame + element.defaultDuration,
          selectedTemplate.duration
        ),
        color: element.color,
        elementId: element.id, // Link to scene element for dynamic rendering
      });

      setElementSelectorOpen(false);
    },
    [scenes, addScene, selectedTemplate.duration]
  );

  // SRT file upload handler
  const handleSrtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const parsedCaptions = parseSrt(text, fps.id);
      setCaptions(parsedCaptions);
    }
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
            selectedTemplate.id === "template1"
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
                  sceneTimings: scenes,
                }
              : selectedTemplate.id === "template2"
              ? {
                  recipientName,
                  presenterVideoUrl,
                  logoUrl,
                  musicTracks,
                  customClips,
                  captions,
                  captionSettings,
                  userName: t5UserName,
                  cardNumber: t5CardNumber,
                  limitUtilised: t5LimitUtilised,
                  totalLimit: t5TotalLimit,
                  availableLimit: t5AvailableLimit,
                  brandText: t5BrandText,
                  ctaText: t5CtaText,
                  sceneTimings: scenes,
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

  // Build input props based on selected template
  const getInputProps = (): Record<string, unknown> => {
    if (selectedTemplate.id === "template1") {
      return {
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
        sceneTimings: scenes,
      };
    } else if (selectedTemplate.id === "template2") {
      return {
        recipientName,
        presenterVideoUrl,
        logoUrl,
        musicTracks,
        customClips,
        captions,
        captionSettings,
        userName: t5UserName,
        cardNumber: t5CardNumber,
        limitUtilised: t5LimitUtilised,
        totalLimit: t5TotalLimit,
        availableLimit: t5AvailableLimit,
        brandText: t5BrandText,
        ctaText: t5CtaText,
        sceneTimings: scenes,
      };
    }
    return {
      productImages,
      reviewText,
      reviewAuthor,
      rating,
      customClips,
      musicTracks,
    };
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-50 overflow-hidden">
      {/* Top Toolbar */}
      <Header
        selectedTemplate={selectedTemplate}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        fps={fps}
        setFps={setFps}
        isExporting={isExporting}
        exportProgress={exportProgress}
        onExport={handleExport}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Templates & Media */}
        <LeftPanel
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          productImages={productImages}
          customClips={customClips}
          onImageUpload={handleImageUpload}
          onCustomClipUpload={handleCustomClipUpload}
          onRemoveClip={removeClip}
        />

        {/* Center - Preview */}
        <VideoPreview
          playerRef={playerRef}
          playerContainerRef={playerContainerRef}
          isMounted={isMounted}
          selectedTemplate={selectedTemplate}
          aspectRatio={aspectRatio}
          fps={fps.id}
          inputProps={getInputProps()}
        />

        {/* Right Panel - Properties */}
        <RightPanel
          selectedTemplate={selectedTemplate}
          scenes={scenes}
          setScenes={setScenes}
          fps={fps}
          updateScene={updateScene}
          updateSceneProperties={updateSceneProperties}
          removeScene={removeScene}
          handleSeek={handleSeek}
          onOpenElementSelector={() => setElementSelectorOpen(true)}
          template1Props={{
            recipientName,
            setRecipientName,
            phoneName,
            setPhoneName,
            presenterVideoUrl,
            setPresenterVideoUrl,
            productImageUrl,
            logoUrl,
            usePhoneTease,
            setUsePhoneTease,
            captions,
            setCaptions,
            captionSettings,
            setCaptionSettings,
            onPresenterVideoUpload: handlePresenterVideoUpload,
            onProductImageUpload: handleProductImageUpload,
            onLogoUpload: handleLogoUpload,
            onSrtUpload: handleSrtUpload,
            onOpenCaptionEditor: () => setCaptionEditorOpen(true),
            fps,
          }}
          template2Props={{
            recipientName,
            setRecipientName,
            presenterVideoUrl,
            setPresenterVideoUrl,
            logoUrl,
            captions,
            setCaptions,
            t5UserName,
            setT5UserName,
            t5CardNumber,
            setT5CardNumber,
            t5LimitUtilised,
            setT5LimitUtilised,
            t5TotalLimit,
            setT5TotalLimit,
            t5AvailableLimit,
            setT5AvailableLimit,
            t5BrandText,
            setT5BrandText,
            t5CtaText,
            setT5CtaText,
            onPresenterVideoUpload: handlePresenterVideoUpload,
            onLogoUpload: handleLogoUpload,
            onSrtUpload: handleSrtUpload,
            onOpenCaptionEditor: () => setCaptionEditorOpen(true),
          }}
          defaultProps={{
            reviewText,
            setReviewText,
            reviewAuthor,
            setReviewAuthor,
            rating,
            setRating,
          }}
        />
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
          onClipLayerUpdate={updateClipLayer}
          onClipRemove={removeClip}
          scenes={scenes}
          onSceneUpdate={updateScene}
          musicTracks={musicTracks}
          onMusicUpload={handleMusicUpload}
          onMusicTrackUpdate={updateMusicTrack}
          onMusicTrackRemove={removeMusicTrack}
        />
      </div>

      {/* Caption Editor Modal */}
      <CaptionEditorModal
        isOpen={captionEditorOpen}
        onClose={() => setCaptionEditorOpen(false)}
        captions={captions}
        setCaptions={setCaptions}
        fps={fps.id}
      />

      {/* Scene Element Selector Modal */}
      <SceneElementSelectorModal
        isOpen={elementSelectorOpen}
        onClose={() => setElementSelectorOpen(false)}
        onSelect={handleElementSelect}
      />
    </div>
  );
}
