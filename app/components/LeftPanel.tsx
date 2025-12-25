import React from "react";
import { CustomClip, TemplateConfig } from "@/app/types";
import { templates } from "@/app/constants/editorConfig";

interface LeftPanelProps {
  selectedTemplate: TemplateConfig;
  setSelectedTemplate: (template: TemplateConfig) => void;
  productImages: string[];
  customClips: CustomClip[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomClipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveClip: (id: string) => void;
}

export function LeftPanel({
  selectedTemplate,
  setSelectedTemplate,
  productImages,
  customClips,
  onImageUpload,
  onCustomClipUpload,
  onRemoveClip,
}: LeftPanelProps) {
  return (
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
            <div className="font-medium text-slate-100">{template.name}</div>
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
                onChange={onImageUpload}
                className="hidden"
              />
              <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-3 cursor-pointer hover:border-slate-600">
                <span className="text-[10px] text-slate-400">+ Add Images</span>
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
              onChange={onCustomClipUpload}
              className="hidden"
            />
            <div className="flex items-center justify-center rounded-lg border border-dashed border-slate-700 p-3 cursor-pointer hover:border-slate-600">
              <span className="text-[10px] text-slate-400">+ Add Clips</span>
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
                    onClick={() => onRemoveClip(clip.id)}
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
  );
}
