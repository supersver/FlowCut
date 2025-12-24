import { Template1 } from "@/remotion/templates/Template1";
import { Template2 } from "@/remotion/templates/Template2";
import {
  AspectRatio,
  FpsOption,
  SceneDefinition,
  TemplateConfig,
} from "@/app/types";

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: "9:16", name: "Portrait (9:16)", width: 1080, height: 1920 },
  { id: "16:9", name: "Landscape (16:9)", width: 1920, height: 1080 },
  { id: "1:1", name: "Square (1:1)", width: 1080, height: 1080 },
  { id: "4:5", name: "Instagram (4:5)", width: 1080, height: 1350 },
];

export const FPS_OPTIONS: FpsOption[] = [
  { id: 24, name: "24 fps", description: "Cinematic" },
  { id: 30, name: "30 fps", description: "Standard" },
  { id: 60, name: "60 fps", description: "Smooth" },
];

export const DEFAULT_SCENES: Record<string, SceneDefinition[]> = {
  template1: [
    {
      id: "t1-s1",
      name: "Intro",
      startFrame: 0,
      endFrame: 90,
      color: "linear-gradient(90deg, #3b82f6, #6366f1)",
    },
    {
      id: "t1-s2",
      name: "Context",
      startFrame: 90,
      endFrame: 210,
      color: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    },
    {
      id: "t1-s3",
      name: "Promise",
      startFrame: 210,
      endFrame: 420,
      color: "linear-gradient(90deg, #8b5cf6, #a855f7)",
    },
    {
      id: "t1-s4",
      name: "Phone Reveal",
      startFrame: 420,
      endFrame: 540,
      color: "linear-gradient(90deg, #a855f7, #d946ef)",
    },
    {
      id: "t1-s5",
      name: "WhatsApp CTA",
      startFrame: 540,
      endFrame: 650,
      color: "linear-gradient(90deg, #d946ef, #ec4899)",
    },
    {
      id: "t1-s6",
      name: "Outro",
      startFrame: 650,
      endFrame: 750,
      color: "linear-gradient(90deg, #ec4899, #f43f5e)",
    },
  ],
  template2: [
    {
      id: "t2-s1",
      name: "Greeting",
      startFrame: 0,
      endFrame: 90,
      color: "linear-gradient(90deg, #10b981, #14b8a6)",
    },
    {
      id: "t2-s2",
      name: "Credit Card",
      startFrame: 90,
      endFrame: 240,
      color: "linear-gradient(90deg, #14b8a6, #06b6d4)",
    },
    {
      id: "t2-s3",
      name: "Spending",
      startFrame: 240,
      endFrame: 480,
      color: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
    },
    {
      id: "t2-s4",
      name: "Merchants",
      startFrame: 480,
      endFrame: 630,
      color: "linear-gradient(90deg, #0ea5e9, #3b82f6)",
    },
    {
      id: "t2-s5",
      name: "EMI Card",
      startFrame: 630,
      endFrame: 780,
      color: "linear-gradient(90deg, #3b82f6, #6366f1)",
    },
    {
      id: "t2-s6",
      name: "Presenter",
      startFrame: 780,
      endFrame: 930,
      color: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    },
    {
      id: "t2-s7",
      name: "Closing CTA",
      startFrame: 930,
      endFrame: 1050,
      color: "linear-gradient(90deg, #8b5cf6, #a855f7)",
    },
  ],
};

export const templates: TemplateConfig[] = [
  {
    id: "template1",
    name: "WhatsApp Pre-Launch",
    description: "Personalized video with phone tease & WhatsApp CTA.",
    duration: 750,
    component: Template1,
  },
  {
    id: "template2",
    name: "Financial Services",
    description:
      "Credit card with spending analytics, merchant breakdown & EMI options.",
    duration: 1050,
    component: Template2,
  },
];
