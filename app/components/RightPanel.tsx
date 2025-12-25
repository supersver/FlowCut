import React from "react";
import { SceneDefinition, TemplateConfig, FpsOption } from "@/app/types";
import { CaptionItem, CaptionSettings } from "@/lib/parseSrt";
import { DEFAULT_SCENES } from "@/app/constants/editorConfig";

interface Template1Props {
  recipientName: string;
  setRecipientName: (v: string) => void;
  phoneName: string;
  setPhoneName: (v: string) => void;
  presenterVideoUrl: string;
  setPresenterVideoUrl: (v: string) => void;
  productImageUrl: string;
  logoUrl: string;
  usePhoneTease: boolean;
  setUsePhoneTease: (v: boolean) => void;
  captions: CaptionItem[];
  setCaptions: React.Dispatch<React.SetStateAction<CaptionItem[]>>;
  captionSettings: CaptionSettings;
  setCaptionSettings: React.Dispatch<React.SetStateAction<CaptionSettings>>;
  onPresenterVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSrtUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCaptionEditor: () => void;
  fps: FpsOption;
}

interface Template2Props {
  recipientName: string;
  setRecipientName: (v: string) => void;
  presenterVideoUrl: string;
  setPresenterVideoUrl: (v: string) => void;
  logoUrl: string;
  captions: CaptionItem[];
  setCaptions: React.Dispatch<React.SetStateAction<CaptionItem[]>>;
  t5UserName: string;
  setT5UserName: (v: string) => void;
  t5CardNumber: string;
  setT5CardNumber: (v: string) => void;
  t5LimitUtilised: number;
  setT5LimitUtilised: (v: number) => void;
  t5TotalLimit: number;
  setT5TotalLimit: (v: number) => void;
  t5AvailableLimit: number;
  setT5AvailableLimit: (v: number) => void;
  t5BrandText: string;
  setT5BrandText: (v: string) => void;
  t5CtaText: string;
  setT5CtaText: (v: string) => void;
  onPresenterVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSrtUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCaptionEditor: () => void;
}

interface DefaultProps {
  reviewText: string;
  setReviewText: (v: string) => void;
  reviewAuthor: string;
  setReviewAuthor: (v: string) => void;
  rating: number;
  setRating: (v: number) => void;
}

interface RightPanelProps {
  selectedTemplate: TemplateConfig;
  scenes: SceneDefinition[];
  setScenes: React.Dispatch<React.SetStateAction<SceneDefinition[]>>;
  fps: FpsOption;
  updateScene: (id: string, startFrame: number, endFrame: number) => void;
  updateSceneProperties: (
    id: string,
    updates: Partial<SceneDefinition>
  ) => void;
  removeScene: (id: string) => void;
  handleSeek: (frame: number) => void;
  onOpenElementSelector: () => void;
  template1Props: Template1Props;
  template2Props: Template2Props;
  defaultProps: DefaultProps;
}

export function RightPanel({
  selectedTemplate,
  scenes,
  setScenes,
  fps,
  updateScene,
  updateSceneProperties,
  removeScene,
  handleSeek,
  onOpenElementSelector,
  template1Props,
  template2Props,
  defaultProps,
}: RightPanelProps) {
  return (
    <aside className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-slate-800">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Properties
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {selectedTemplate.id === "template1" ? (
          <Template1Properties {...template1Props} />
        ) : selectedTemplate.id === "template2" ? (
          <Template2Properties {...template2Props} />
        ) : (
          <DefaultProperties {...defaultProps} />
        )}

        {/* Scenes Section - Common to all templates */}
        {scenes.length > 0 && (
          <ScenesSection
            scenes={scenes}
            setScenes={setScenes}
            selectedTemplate={selectedTemplate}
            fps={fps}
            updateScene={updateScene}
            updateSceneProperties={updateSceneProperties}
            removeScene={removeScene}
            handleSeek={handleSeek}
            onOpenElementSelector={onOpenElementSelector}
          />
        )}
      </div>
    </aside>
  );
}

function Template1Properties({
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
  onPresenterVideoUpload,
  onProductImageUpload,
  onLogoUpload,
  onSrtUpload,
  onOpenCaptionEditor,
  fps,
}: Template1Props) {
  return (
    <>
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
            onChange={onPresenterVideoUpload}
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
            onChange={onProductImageUpload}
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
            onChange={onLogoUpload}
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
        <span className="text-xs text-slate-300">Use PhoneTease animation</span>
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
            onChange={onSrtUpload}
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
                      position: e.target.value as "top" | "center" | "bottom",
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
                  Text Color
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
                  Background
                </label>
                <input
                  type="color"
                  value={
                    captionSettings.backgroundColor.startsWith("rgba")
                      ? "#000000"
                      : captionSettings.backgroundColor
                  }
                  onChange={(e) =>
                    setCaptionSettings((s) => ({
                      ...s,
                      backgroundColor: e.target.value + "cc", // Add some transparency
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
            <div className="flex gap-2">
              <button
                onClick={onOpenCaptionEditor}
                className="flex-1 text-[10px] text-blue-400 hover:text-blue-300 bg-slate-800 border border-slate-700 rounded px-2 py-1"
              >
                ✏️ Edit Captions
              </button>
              <button
                onClick={() => setCaptions([])}
                className="text-[10px] text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Template2Properties({
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
  onPresenterVideoUpload,
  onLogoUpload,
  onSrtUpload,
  onOpenCaptionEditor,
}: Template2Props) {
  return (
    <>
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
            onChange={onPresenterVideoUpload}
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
            onChange={onLogoUpload}
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
                onChange={(e) => setT5TotalLimit(parseInt(e.target.value) || 0)}
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

      {/* Captions */}
      <div className="border-t border-slate-700 pt-3">
        <label className="block text-[11px] text-slate-400 mb-1">
          Captions (SRT)
        </label>
        <label className="block">
          <input
            type="file"
            accept=".srt"
            onChange={onSrtUpload}
            className="hidden"
          />
          <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-2.5 cursor-pointer hover:border-slate-600 text-[10px] text-slate-400">
            {captions.length > 0
              ? `✓ ${captions.length} captions`
              : "+ Upload SRT file"}
          </div>
        </label>
        {captions.length > 0 && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={onOpenCaptionEditor}
              className="flex-1 text-[10px] text-blue-400 hover:text-blue-300 bg-slate-800 border border-slate-700 rounded px-2 py-1"
            >
              ✏️ Edit Captions
            </button>
            <button
              onClick={() => setCaptions([])}
              className="text-[10px] text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DefaultProperties({
  reviewText,
  setReviewText,
  reviewAuthor,
  setReviewAuthor,
  rating,
  setRating,
}: DefaultProps) {
  return (
    <>
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
        <label className="block text-[11px] text-slate-400 mb-1">Author</label>
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
  );
}

interface ScenesSectionProps {
  scenes: SceneDefinition[];
  setScenes: React.Dispatch<React.SetStateAction<SceneDefinition[]>>;
  selectedTemplate: TemplateConfig;
  fps: FpsOption;
  updateScene: (id: string, startFrame: number, endFrame: number) => void;
  updateSceneProperties: (
    id: string,
    updates: Partial<SceneDefinition>
  ) => void;
  removeScene: (id: string) => void;
  handleSeek: (frame: number) => void;
  onOpenElementSelector: () => void;
}

function ScenesSection({
  scenes,
  setScenes,
  selectedTemplate,
  fps,
  updateScene,
  updateSceneProperties,
  removeScene,
  handleSeek,
  onOpenElementSelector,
}: ScenesSectionProps) {
  return (
    <div className="border-t border-slate-800 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] font-medium text-slate-300">
          🎬 Scenes ({scenes.length})
        </h4>
        <button
          onClick={onOpenElementSelector}
          className="text-[9px] text-blue-400 hover:text-blue-300"
        >
          + Add Scene
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-2"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ background: scene.color }}
              />
              <input
                type="text"
                value={scene.name}
                onChange={(e) =>
                  updateSceneProperties(scene.id, {
                    name: e.target.value,
                  })
                }
                className="flex-1 bg-transparent border-none text-[10px] text-slate-200 font-medium outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
              <button
                onClick={() => handleSeek(scene.startFrame)}
                className="text-[8px] text-slate-400 hover:text-slate-200"
                title="Jump to scene"
              >
                ▶
              </button>
              <button
                onClick={() => removeScene(scene.id)}
                className="text-[8px] text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[8px] text-slate-500 mb-0.5">
                  Start
                </label>
                <input
                  type="number"
                  min="0"
                  max={scene.endFrame - fps.id}
                  value={scene.startFrame}
                  onChange={(e) =>
                    updateScene(
                      scene.id,
                      parseInt(e.target.value) || 0,
                      scene.endFrame
                    )
                  }
                  className="w-full rounded border border-slate-600 bg-slate-700 px-1.5 py-0.5 text-[9px] text-slate-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] text-slate-500 mb-0.5">
                  End
                </label>
                <input
                  type="number"
                  min={scene.startFrame + fps.id}
                  max={selectedTemplate.duration}
                  value={scene.endFrame}
                  onChange={(e) =>
                    updateScene(
                      scene.id,
                      scene.startFrame,
                      parseInt(e.target.value) || scene.startFrame + fps.id
                    )
                  }
                  className="w-full rounded border border-slate-600 bg-slate-700 px-1.5 py-0.5 text-[9px] text-slate-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[8px] text-slate-500 mb-0.5">
                  Duration
                </label>
                <span className="block text-[9px] text-slate-300 px-1.5 py-0.5">
                  {((scene.endFrame - scene.startFrame) / fps.id).toFixed(1)}s
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setScenes(DEFAULT_SCENES[selectedTemplate.id] || [])}
        className="mt-2 text-[9px] text-slate-500 hover:text-slate-400"
      >
        ↺ Reset to defaults
      </button>
    </div>
  );
}
