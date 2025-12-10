"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { Template1 } from "@/remotion/templates/Template1";
import { Template2 } from "@/remotion/templates/Template2";
import { Template3 } from "@/remotion/templates/Template3";

const templates = [
  {
    id: "template1",
    name: "Modern Slide",
    description: "Showcase multiple products with a clean review card.",
    duration: 450,
    component: Template1,
  },
  {
    id: "template2",
    name: "Carousel",
    description: "Fade between products, then highlight a review.",
    duration: 600,
    component: Template2,
  },
  {
    id: "template3",
    name: "Split Screen",
    description: "Hero product at the top with a bold review section.",
    duration: 750,
    component: Template3,
  },
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [productImages, setProductImages] = useState([
    "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Product+1",
  ]);
  const [reviewText, setReviewText] = useState(
    "Amazing product! Highly recommend!"
  );
  const [reviewAuthor, setReviewAuthor] = useState("John Doe");
  const [rating, setRating] = useState(5);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setProductImages(urls);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top gradient background accent */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-blue-500/40 via-purple-500/20 to-transparent blur-3xl" />
      <div className="relative z-10">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/40">
                <span className="text-xs font-semibold tracking-wider">FC</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  FlowCut Studio
                </h1>
                <p className="text-xs text-slate-400">
                  Generate product review videos in seconds
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-xs text-slate-400 sm:flex">
              <span className="rounded-full bg-slate-900 px-3 py-1">
                1080 × 1920 • 30 fps
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1">
                Templates: {templates.length}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6 lg:py-10">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Create a product video
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Choose a template, drop in your product images, and customize
                the review content. The preview updates in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Auto-animated
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-300">
                Tailwind + Remotion
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Preview Section */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/60">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-slate-100">
                    Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live playback of the selected template with your content.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-blue-500/40 transition hover:brightness-110"
                >
                  Render video
                </button>
              </div>

              <div className="relative mx-auto max-w-[320px] sm:max-w-[360px] md:max-w-[380px]">
                {/* Phone frame */}
                <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-slate-700/80 shadow-[0_0_0_1px_rgba(15,23,42,0.8)]" />
                <div className="pointer-events-none absolute left-1/2 top-2 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900/80" />
                <div className="pointer-events-none absolute bottom-2 left-1/2 h-1.5 w-20 -translate-x-1/2 rounded-full bg-slate-800/80" />

                <div className="aspect-[9/16] overflow-hidden rounded-[2.25rem] border border-slate-800 bg-black">
                  <Player
                    component={selectedTemplate.component}
                    durationInFrames={selectedTemplate.duration}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    fps={30}
                    inputProps={{
                      productImages,
                      reviewText,
                      reviewAuthor,
                      rating,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    controls
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  {selectedTemplate.name} • {selectedTemplate.duration / 30}s
                </span>
                <span className="rounded-full bg-slate-800 px-3 py-1">
                  Rating: {rating}★
                </span>
              </div>
            </section>

            {/* Controls Section */}
            <section className="space-y-5">
              {/* Template Selection */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  1. Choose a template
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Pick a layout that fits your product and platform.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {templates.map((template) => {
                    const isSelected = selectedTemplate.id === template.id;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplate(template)}
                        className={`group flex flex-col rounded-xl border px-3 py-3 text-left text-xs transition ${
                          isSelected
                            ? "border-blue-500/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.4)]"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <span className="mb-0.5 flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              isSelected ? "text-slate-50" : "text-slate-100"
                            }`}
                          >
                            {template.name}
                          </span>
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                            {template.duration / 30}s
                          </span>
                        </span>
                        <p className="line-clamp-2 text-[11px] text-slate-400">
                          {template.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Images */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  2. Add product images
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Upload up to a few images. They will automatically animate in
                  the chosen template.
                </p>

                <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-3 text-xs text-slate-300 transition hover:border-blue-500/60 hover:bg-slate-900/80">
                  <div>
                    <span className="font-medium">Upload images</span>
                    <p className="text-[11px] text-slate-400">
                      PNG or JPG, high resolution recommended.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                    Select files
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {productImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
                    >
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="h-24 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-slate-100">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                  {productImages.length === 0 && (
                    <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-4 text-center text-xs text-slate-500">
                      No images added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Review Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="text-sm font-medium text-slate-100">
                  3. Customize review
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Control the review text, author and rating stars.
                </p>

                <div className="mt-4 space-y-4 text-xs">
                  <div>
                    <label className="mb-1.5 block font-medium text-slate-200">
                      Review text
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                      rows={3}
                      placeholder="Share what customers love about this product..."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
                    <div>
                      <label className="mb-1.5 block font-medium text-slate-200">
                        Author name
                      </label>
                      <input
                        type="text"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                        placeholder="e.g. Sarah M."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-medium text-slate-200">
                        Rating
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                        <div className="flex min-w-[3.5rem] flex-col items-end text-[11px] text-slate-200">
                          <span className="font-semibold">{rating}.0</span>
                          <span className="text-yellow-400">
                            {"★".repeat(rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
