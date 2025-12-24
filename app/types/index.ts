import React from "react";

export interface CustomClip {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  type: "image" | "video";
  layer: number; // 0 = background (replaces template), 1+ = overlay on top
}

export interface MusicTrack {
  id: string;
  url: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

// Shared props interface for all templates
export interface TemplateProps {
  productImages: string[];
  reviewText: string;
  reviewAuthor: string;
  rating: number;
  customClips?: CustomClip[];
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
}

// Scene definition for timeline visualization
export interface SceneDefinition {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  color: string;
  elementId?: string; // Links to SCENE_ELEMENTS.id for dynamic rendering
}

export interface AspectRatio {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface FpsOption {
  id: number;
  name: string;
  description: string;
}
