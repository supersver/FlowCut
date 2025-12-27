/**
 * API Route for getting a specific job's status.
 * GET /api/jobs/[id] - Get job status and download URL
 */

import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    templateId: job.templateId,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    downloadUrl: job.downloadUrl,
    error: job.error,
  });
}
