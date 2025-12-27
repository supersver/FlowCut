/**
 * Callback endpoint for Modal/render completion.
 * POST /api/callback - Called by Modal when render is complete
 */

import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob } from "@/lib/jobs";
import { getPresignedDownloadUrl, getRenderKey } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobId,
      success,
      s3Key,
      error,
      downloadUrl: providedUrl,
      localPath,
    } = body;

    console.log(`[Callback] Received callback for job ${jobId}:`, {
      success,
      s3Key,
      error,
    });

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const job = getJob(jobId);
    if (!job) {
      console.warn(`[Callback] Job ${jobId} not found`);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (success) {
      let downloadUrl = providedUrl;

      // Generate presigned URL if we have an S3 key but no URL
      if (!downloadUrl && s3Key) {
        try {
          downloadUrl = await getPresignedDownloadUrl(s3Key);
        } catch (urlError) {
          console.error(
            "[Callback] Failed to generate presigned URL:",
            urlError
          );
        }
      }

      // If we still don't have a URL but have a local path, create a local download endpoint
      if (!downloadUrl && localPath) {
        downloadUrl = `/api/download/${jobId}`;
      }

      updateJob(jobId, {
        status: "complete",
        downloadUrl,
        s3Key,
      });

      console.log(
        `[Callback] Job ${jobId} marked complete, download URL:`,
        downloadUrl
      );
    } else {
      updateJob(jobId, {
        status: "failed",
        error: error || "Unknown error",
      });

      console.log(`[Callback] Job ${jobId} marked failed:`, error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Callback] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Callback failed" },
      { status: 500 }
    );
  }
}
