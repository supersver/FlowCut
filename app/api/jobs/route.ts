/**
 * API Route for creating and listing render jobs.
 * POST /api/jobs - Create a new render job
 * GET /api/jobs - List all jobs (for debugging)
 */

import { NextRequest, NextResponse } from "next/server";
import { createJob, generateJobId, getAllJobs, updateJob } from "@/lib/jobs";

// Modal function endpoint (deployed Modal app)
const MODAL_FUNCTION_URL =
  process.env.MODAL_FUNCTION_URL ||
  "https://supersver--flowcut-render-render-video.modal.run";

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

    if (!templateId || !duration) {
      return NextResponse.json(
        { error: "Missing required fields: templateId, duration" },
        { status: 400 }
      );
    }

    // Generate a unique job ID
    const jobId = generateJobId();

    // Create the job in our store
    const job = createJob({
      id: jobId,
      templateId,
      duration,
      props: props || {},
      width,
      height,
      fps,
    });

    console.log(`[Jobs API] Created job ${jobId}, triggering render...`);

    // Update job status to processing
    updateJob(jobId, { status: "processing" });

    // Check if we should use local rendering (for development)
    // Modal callbacks can't reach localhost, so use local render for dev
    const useLocalRender =
      !process.env.CALLBACK_BASE_URL ||
      process.env.CALLBACK_BASE_URL.includes("localhost");

    if (useLocalRender) {
      console.log("[Jobs API] Using local render (localhost detected)");

      // Trigger local render in background (don't await)
      triggerLocalRender(
        jobId,
        templateId,
        duration,
        props,
        width,
        height,
        fps
      ).catch((error) => {
        console.error("[Jobs API] Local render error:", error);
        updateJob(jobId, {
          status: "failed",
          error: error instanceof Error ? error.message : "Render failed",
        });
      });
    } else {
      // Production: Trigger Modal render (fire and forget)
      // Modal will upload to S3, and we'll poll S3 for completion
      const callbackUrl = `${process.env.CALLBACK_BASE_URL}/api/callback`;

      console.log(`[Jobs API] Triggering Modal with callback: ${callbackUrl}`);

      // Fire and forget - don't await the full response
      fetch(MODAL_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          template_id: templateId,
          duration,
          props: props || {},
          width,
          height,
          fps,
          callback_url: callbackUrl,
        }),
      }).catch((error) => {
        console.error("[Jobs API] Modal trigger error:", error);
      });
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      message: "Render job created and queued",
    });
  } catch (error) {
    console.error("[Jobs API] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create job",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all jobs (for debugging)
  const jobs = getAllJobs();
  return NextResponse.json({ jobs });
}

/**
 * Fallback: trigger local render using existing scripts/render.js
 * Updates job status directly instead of using callbacks
 */
async function triggerLocalRender(
  jobId: string,
  templateId: string,
  duration: number,
  props: Record<string, unknown>,
  width: number,
  height: number,
  fps: number
) {
  const { spawn } = await import("child_process");
  const path = await import("path");
  const fs = await import("fs");
  const os = await import("os");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flowcut-"));
  const outputPath = path.join(tempDir, "output.mp4");

  return new Promise<void>((resolve, reject) => {
    const renderProcess = spawn(
      "node",
      [path.join(process.cwd(), "scripts", "render.js")],
      {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

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
      console.log("[Local Render]", data.toString());
    });

    renderProcess.on("close", async (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        // Upload to S3 if configured
        try {
          const { uploadToS3, getRenderKey, getPresignedDownloadUrl } =
            await import("@/lib/s3");
          const videoBuffer = fs.readFileSync(outputPath);
          const s3Key = getRenderKey(jobId);

          await uploadToS3(videoBuffer, s3Key);
          const downloadUrl = await getPresignedDownloadUrl(s3Key);

          // Update job directly
          updateJob(jobId, {
            status: "complete",
            s3Key,
            downloadUrl,
          });

          console.log(
            `[Local Render] Job ${jobId} complete, downloadUrl: ${downloadUrl}`
          );
          resolve();
        } catch (uploadError) {
          console.error("[Local Render] S3 upload error:", uploadError);

          // Update job as failed
          updateJob(jobId, {
            status: "failed",
            error:
              uploadError instanceof Error
                ? uploadError.message
                : "S3 upload failed",
          });

          reject(uploadError);
        }
      } else {
        const errorMsg = stderr || "Render failed";
        updateJob(jobId, {
          status: "failed",
          error: errorMsg,
        });
        reject(new Error(errorMsg));
      }

      // Cleanup
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    });

    renderProcess.on("error", (err) => {
      updateJob(jobId, {
        status: "failed",
        error: err.message,
      });
      reject(err);
    });
  });
}
