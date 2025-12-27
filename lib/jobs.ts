/**
 * In-memory job store for render jobs.
 * Uses globalThis to persist across Next.js dev mode hot reloads.
 * Can be upgraded to Redis or a database for production use.
 */

export type JobStatus = "pending" | "processing" | "complete" | "failed";

export interface RenderJob {
  id: string;
  templateId: string;
  duration: number;
  props: Record<string, unknown>;
  width: number;
  height: number;
  fps: number;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  downloadUrl?: string;
  error?: string;
  s3Key?: string;
}

// Extend globalThis type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __flowcutJobs: Map<string, RenderJob> | undefined;
}

// Use globalThis to persist across Next.js hot reloads
const jobs = globalThis.__flowcutJobs ?? new Map<string, RenderJob>();
globalThis.__flowcutJobs = jobs;

/**
 * Generate a unique job ID
 */
export function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new render job
 */
export function createJob(params: {
  id: string;
  templateId: string;
  duration: number;
  props: Record<string, unknown>;
  width: number;
  height: number;
  fps: number;
}): RenderJob {
  const job: RenderJob = {
    ...params,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  jobs.set(params.id, job);
  return job;
}

/**
 * Get a job by ID
 */
export function getJob(id: string): RenderJob | undefined {
  return jobs.get(id);
}

/**
 * Update a job's status
 */
export function updateJob(
  id: string,
  updates: Partial<
    Pick<RenderJob, "status" | "downloadUrl" | "error" | "s3Key">
  >
): RenderJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;

  const updatedJob: RenderJob = {
    ...job,
    ...updates,
    updatedAt: new Date(),
  };
  jobs.set(id, updatedJob);
  return updatedJob;
}

/**
 * Delete a job (cleanup)
 */
export function deleteJob(id: string): boolean {
  return jobs.delete(id);
}

/**
 * Get all jobs (for debugging)
 */
export function getAllJobs(): RenderJob[] {
  return Array.from(jobs.values());
}
