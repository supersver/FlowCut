import React from "react";
import { AspectRatio, FpsOption, TemplateConfig } from "@/app/types";
import { ASPECT_RATIOS, FPS_OPTIONS } from "@/app/constants/editorConfig";

interface HeaderProps {
  selectedTemplate: TemplateConfig;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  fps: FpsOption;
  setFps: (fps: FpsOption) => void;
  isExporting: boolean;
  exportProgress: number;
  onExport: () => void;
}

export function Header({
  selectedTemplate,
  aspectRatio,
  setAspectRatio,
  fps,
  setFps,
  isExporting,
  exportProgress,
  onExport,
}: HeaderProps) {
  return (
    <>
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
            onClick={onExport}
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
    </>
  );
}
