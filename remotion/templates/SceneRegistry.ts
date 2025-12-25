// Scene Registry - Maps element IDs to their React components
// This enables dynamic scene rendering based on the scenes array

import React from "react";

// Template 1 Components
import { IntroPresenter } from "./Template1/Components/IntroPresenter";
import { ContextLayer } from "./Template1/Components/ContextLayer";
import { PromiseText } from "./Template1/Components/PromiseText";
import { PhoneTease } from "./Template1/Components/PhoneTease";
import { WhatsAppCTA } from "./Template1/Components/WhatsAppCTA";
import { Outro } from "./Template1/Components/Outro";

// Template 2 Components
import { GreetingBanner } from "./Template2/Components/GreetingBanner";
import { CreditCard } from "./Template2/Components/CreditCard";
import { SpendingCategories } from "./Template2/Components/SpendingCategories";
import { MerchantList } from "./Template2/Components/MerchantList";
import { EMICard } from "./Template2/Components/EMICard";
import { ClosingCTA } from "./Template2/Components/ClosingCTA";

// Scene element definition with component reference
export interface SceneWithComponent {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  color: string;
  elementId?: string; // Links to SCENE_ELEMENTS.id
}

// Component props interfaces
export interface SceneComponentProps {
  recipientName?: string;
  phoneName?: string;
  productImageUrl?: string;
  logoUrl?: string;
  userName?: string;
  cardNumber?: string;
  limitUtilised?: number;
  totalLimit?: number;
  availableLimit?: number;
  categories?: Array<{
    name: string;
    percentage: number;
    amount: number;
    icon: string;
  }>;
  merchants?: Array<{
    name: string;
    logo?: string;
    count: number;
    total: number;
  }>;
  transactions?: Array<{
    name: string;
    amount: number;
    emiMonths: number;
    emiAmount: number;
  }>;
  brandText?: string;
  ctaText?: string;
  globalFrame?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SceneComponent = React.FC<any>;

// Registry mapping element IDs to their components
export const SCENE_COMPONENT_REGISTRY: Record<string, SceneComponent> = {
  // Template 1 elements
  "intro-presenter": IntroPresenter,
  "context-layer": ContextLayer,
  "promise-text": PromiseText,
  "phone-tease": PhoneTease,
  "whatsapp-cta": WhatsAppCTA,
  outro: Outro,

  // Template 2 elements
  "greeting-banner": GreetingBanner,
  "credit-card": CreditCard,
  "spending-categories": SpendingCategories,
  "merchant-list": MerchantList,
  "emi-card": EMICard,
  "closing-cta": ClosingCTA,

  // Common elements (shared across templates)
  "presenter-only": () => null, // Handled separately (just presenter video)
};

// Get component for a scene element
export const getSceneComponent = (elementId: string): SceneComponent | null => {
  return SCENE_COMPONENT_REGISTRY[elementId] || null;
};

// Default element ID mappings for existing template scenes
// Maps scene IDs (t1-s1, t1-s2, etc.) to element IDs (intro-presenter, etc.)
export const DEFAULT_SCENE_ELEMENT_MAP: Record<string, string> = {
  // Template 1 scenes
  "t1-s1": "intro-presenter",
  "t1-s2": "context-layer",
  "t1-s3": "promise-text",
  "t1-s4": "phone-tease",
  "t1-s5": "whatsapp-cta",
  "t1-s6": "outro",

  // Template 2 scenes
  "t2-s1": "greeting-banner",
  "t2-s2": "credit-card",
  "t2-s3": "spending-categories",
  "t2-s4": "merchant-list",
  "t2-s5": "emi-card",
  "t2-s6": "presenter-only",
  "t2-s7": "closing-cta",
};

// Get element ID for a scene (by scene ID or directly if scene has elementId)
export const getElementIdForScene = (
  scene: SceneWithComponent
): string | null => {
  if (scene.elementId) {
    return scene.elementId;
  }
  return DEFAULT_SCENE_ELEMENT_MAP[scene.id] || null;
};
