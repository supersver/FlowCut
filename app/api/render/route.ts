import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateId,
      duration,
      props,
      width = 1080,
      height = 1920,
      fps = 30,
    } = body;

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
          fps,
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

    // Stream the rendered video instead of loading it all into memory
    const videoStream = fs.createReadStream(outputPath);
    const stat = fs.statSync(outputPath);

    // Create a ReadableStream from the Node.js stream
    const webStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => {
          controller.close();
          // Clean up temp directory after streaming is done
          fs.rmSync(tempDir, { recursive: true, force: true });
        });
        videoStream.on("error", (err) => controller.error(err));
      },
    });

    // Return video file as a stream
    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": stat.size.toString(),
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
