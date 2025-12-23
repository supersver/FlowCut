"use client";

import React from "react";
import {
  SCENE_ELEMENTS,
  SceneElement,
  getElementsByCategory,
} from "../constants/SCENE_ELEMENTS";

interface SceneElementSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (element: SceneElement) => void;
}

export const SceneElementSelectorModal: React.FC<
  SceneElementSelectorModalProps
> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const introElements = getElementsByCategory("intro");
  const contentElements = getElementsByCategory("content");
  const ctaElements = getElementsByCategory("cta");

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getTemplateBadge = (template: SceneElement["template"]) => {
    switch (template) {
      case "template4":
        return (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
            T4
          </span>
        );
      case "template5":
        return (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
            T5
          </span>
        );
      default:
        return (
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 font-medium">
            All
          </span>
        );
    }
  };

  const ElementCard: React.FC<{ element: SceneElement }> = ({ element }) => (
    <button
      onClick={() => onSelect(element)}
      className="group flex flex-col gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 hover:bg-slate-700/60 transition-all duration-200 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{element.icon}</span>
          <div>
            <div className="text-xs font-medium text-slate-200 group-hover:text-white">
              {element.name}
            </div>
            <div className="text-[10px] text-slate-500">
              {(element.defaultDuration / 30).toFixed(1)}s
            </div>
          </div>
        </div>
        {getTemplateBadge(element.template)}
      </div>
      <p className="text-[10px] text-slate-400 leading-relaxed">
        {element.description}
      </p>
      <div
        className="h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: element.color }}
      />
    </button>
  );

  const CategorySection: React.FC<{
    title: string;
    icon: string;
    elements: SceneElement[];
  }> = ({ title, icon, elements }) => (
    <div>
      <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <span>{icon}</span>
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {elements.map((element) => (
          <ElementCard key={element.id} element={element} />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Add Scene Element
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Choose an element to add to your timeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <CategorySection
            title="Intro Elements"
            icon="🎬"
            elements={introElements}
          />
          <CategorySection
            title="Content Elements"
            icon="📦"
            elements={contentElements}
          />
          <CategorySection
            title="CTA Elements"
            icon="🎯"
            elements={ctaElements}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
