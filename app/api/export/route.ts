import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, props } = body;

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
      webpackOverride: (config) => config,
    });

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: templateId,
      inputProps: props,
    });

    // Output path
    const outputPath = path.join(
      process.cwd(),
      "public",
      "exports",
      `video-${Date.now()}.mp4`
    );

    // Ensure exports directory exists
    const exportsDir = path.join(process.cwd(), "public", "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Render video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
    });

    // Return the video URL
    return NextResponse.json({
      success: true,
      videoUrl: `/exports/${path.basename(outputPath)}`,
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Export failed" },
      { status: 500 }
    );
  }
}
