import React from "react";
import { CaptionItem } from "@/lib/parseSrt";

interface CaptionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  captions: CaptionItem[];
  setCaptions: React.Dispatch<React.SetStateAction<CaptionItem[]>>;
  fps: number;
}

export function CaptionEditorModal({
  isOpen,
  onClose,
  captions,
  setCaptions,
  fps,
}: CaptionEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            ✏️ Edit Captions
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {captions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="mb-4">
                No captions yet. Add your first caption below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {captions.map((caption, index) => (
                <div
                  key={caption.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      #{index + 1}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <label className="text-[10px] text-slate-400">
                        Start:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={caption.startFrame}
                        onChange={(e) => {
                          const newCaptions = [...captions];
                          newCaptions[index] = {
                            ...newCaptions[index],
                            startFrame: parseInt(e.target.value) || 0,
                          };
                          setCaptions(newCaptions);
                        }}
                        className="w-20 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-[11px] text-slate-100"
                      />
                      <span className="text-[10px] text-slate-500">
                        ({(caption.startFrame / fps).toFixed(1)}s)
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <label className="text-[10px] text-slate-400">End:</label>
                      <input
                        type="number"
                        min="0"
                        value={caption.endFrame}
                        onChange={(e) => {
                          const newCaptions = [...captions];
                          newCaptions[index] = {
                            ...newCaptions[index],
                            endFrame: parseInt(e.target.value) || 0,
                          };
                          setCaptions(newCaptions);
                        }}
                        className="w-20 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-[11px] text-slate-100"
                      />
                      <span className="text-[10px] text-slate-500">
                        ({(caption.endFrame / fps).toFixed(1)}s)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCaptions(
                          captions.filter((c) => c.id !== caption.id)
                        );
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                    >
                      🗑️
                    </button>
                  </div>
                  <textarea
                    value={caption.text}
                    onChange={(e) => {
                      const newCaptions = [...captions];
                      newCaptions[index] = {
                        ...newCaptions[index],
                        text: e.target.value,
                      };
                      setCaptions(newCaptions);
                    }}
                    className="w-full rounded border border-slate-600 bg-slate-700 px-2 py-1.5 text-xs text-slate-100 resize-none"
                    rows={2}
                    placeholder="Caption text..."
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <button
            onClick={() => {
              const lastCaption = captions[captions.length - 1];
              const newStartFrame = lastCaption ? lastCaption.endFrame : 0;
              const newCaption: CaptionItem = {
                id: `caption-${Date.now()}`,
                startFrame: newStartFrame,
                endFrame: newStartFrame + fps * 2, // 2 seconds default
                text: "",
              };
              setCaptions([...captions, newCaption]);
            }}
            className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          >
            + Add Caption
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
