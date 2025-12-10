import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import os from "os";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, duration, props } = body;

    // Create temporary directory for output
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flowcut-"));
    const outputPath = path.join(tempDir, "output.mp4");

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

    // Render video
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames: duration,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
    });

    // Read the rendered video
    const videoBuffer = fs.readFileSync(outputPath);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    // Return video file
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="flowcut-video-${Date.now()}.mp4"`,
      },
    });
  } catch (error) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: "Failed to render video" },
      { status: 500 }
    );
  }
}
