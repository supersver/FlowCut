// Scene Element Catalog - All available elements that can be added to scenes

export interface SceneElement {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultDuration: number; // in frames at 30fps
  template: "template4" | "template5" | "common";
  category: "intro" | "content" | "cta" | "overlay";
  color: string; // gradient color for timeline
}

export const SCENE_ELEMENTS: SceneElement[] = [
  // Template 4 Elements
  {
    id: "intro-presenter",
    name: "Intro Presenter",
    icon: "👋",
    description: "Personal greeting with presenter video",
    defaultDuration: 90,
    template: "template4",
    category: "intro",
    color: "linear-gradient(90deg, #3b82f6, #6366f1)",
  },
  {
    id: "context-layer",
    name: "Context Layer",
    icon: "📋",
    description: "Feature cards sidebar animation",
    defaultDuration: 120,
    template: "template4",
    category: "content",
    color: "linear-gradient(90deg, #6366f1, #8b5cf6)",
  },
  {
    id: "promise-text",
    name: "Promise Text",
    icon: "✨",
    description: "Text banner with core promise",
    defaultDuration: 210,
    template: "template4",
    category: "content",
    color: "linear-gradient(90deg, #8b5cf6, #a855f7)",
  },
  {
    id: "phone-tease",
    name: "Phone Reveal",
    icon: "📱",
    description: "Product reveal with phone animation",
    defaultDuration: 120,
    template: "template4",
    category: "content",
    color: "linear-gradient(90deg, #a855f7, #d946ef)",
  },
  {
    id: "whatsapp-cta",
    name: "WhatsApp CTA",
    icon: "💬",
    description: "WhatsApp reply button animation",
    defaultDuration: 110,
    template: "template4",
    category: "cta",
    color: "linear-gradient(90deg, #22c55e, #16a34a)",
  },

  // Template 5 Elements
  {
    id: "greeting-banner",
    name: "Greeting Banner",
    icon: "🎉",
    description: "Welcome greeting animation",
    defaultDuration: 90,
    template: "template5",
    category: "intro",
    color: "linear-gradient(90deg, #10b981, #14b8a6)",
  },
  {
    id: "credit-card",
    name: "Credit Card",
    icon: "💳",
    description: "Animated credit card display",
    defaultDuration: 150,
    template: "template5",
    category: "content",
    color: "linear-gradient(90deg, #14b8a6, #06b6d4)",
  },
  {
    id: "spending-categories",
    name: "Spending Categories",
    icon: "📊",
    description: "Spending breakdown chart",
    defaultDuration: 240,
    template: "template5",
    category: "content",
    color: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
  },
  {
    id: "merchant-list",
    name: "Merchant List",
    icon: "🏪",
    description: "Top merchants list view",
    defaultDuration: 150,
    template: "template5",
    category: "content",
    color: "linear-gradient(90deg, #0ea5e9, #3b82f6)",
  },
  {
    id: "emi-card",
    name: "EMI Card",
    icon: "💰",
    description: "EMI transaction display",
    defaultDuration: 150,
    template: "template5",
    category: "content",
    color: "linear-gradient(90deg, #3b82f6, #6366f1)",
  },
  {
    id: "closing-cta",
    name: "Closing CTA",
    icon: "🎯",
    description: "Final call-to-action screen",
    defaultDuration: 120,
    template: "template5",
    category: "cta",
    color: "linear-gradient(90deg, #ec4899, #f43f5e)",
  },

  // Common/Utility Elements
  {
    id: "presenter-only",
    name: "Presenter Only",
    icon: "🎥",
    description: "Full-screen presenter video",
    defaultDuration: 150,
    template: "common",
    category: "content",
    color: "linear-gradient(90deg, #6366f1, #8b5cf6)",
  },
  {
    id: "outro",
    name: "Outro",
    icon: "👋",
    description: "Closing sign-off scene",
    defaultDuration: 100,
    template: "common",
    category: "cta",
    color: "linear-gradient(90deg, #8b5cf6, #a855f7)",
  },
];

// Helper functions
export const getElementsByCategory = (category: SceneElement["category"]) =>
  SCENE_ELEMENTS.filter((el) => el.category === category);

export const getElementsByTemplate = (template: SceneElement["template"]) =>
  SCENE_ELEMENTS.filter((el) => el.template === template);

export const getElementById = (id: string) =>
  SCENE_ELEMENTS.find((el) => el.id === id);
