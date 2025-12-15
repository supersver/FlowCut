import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, duration, props, width = 1080, height = 1920 } = body;

    // Create temporary directory for output
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flowcut-"));
    const outputPath = path.join(tempDir, "output.mp4");

    // Run the render script as a separate process (avoids webpack bundling issues)
    const result = await new Promise<{
      success: boolean;
      outputPath?: string;
      error?: string;
    }>((resolve) => {
      const renderProcess = spawn(
        "node",
        [path.join(process.cwd(), "scripts", "render.js")],
        {
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        }
      );

      // Send render parameters via stdin
      renderProcess.stdin.write(
        JSON.stringify({
          templateId,
          duration,
          props,
          width,
          height,
          outputPath,
        })
      );
      renderProcess.stdin.end();

      let stdout = "";
      let stderr = "";

      renderProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      renderProcess.stderr.on("data", (data) => {
        stderr += data.toString();
        console.log("[Render]", data.toString());
      });

      renderProcess.on("close", (code) => {
        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch {
          resolve({ success: false, error: stderr || "Unknown error" });
        }
      });

      renderProcess.on("error", (err) => {
        resolve({ success: false, error: err.message });
      });
    });

    if (!result.success) {
      throw new Error(result.error || "Render failed");
    }

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
      {
        error:
          error instanceof Error ? error.message : "Failed to render video",
      },
      { status: 500 }
    );
  }
}
