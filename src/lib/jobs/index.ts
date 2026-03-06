// Job interfaces for background processing

export interface Job {
  id: string;
  type: JobType;
  status: "pending" | "running" | "completed" | "failed";
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
}

export type JobType =
  | "website_crawl"
  | "pdf_extraction"
  | "campaign_generation"
  | "image_rendering";

export async function enqueueJob(
  type: JobType,
  payload: Record<string, unknown>
): Promise<string> {
  // Stub: will be replaced with actual job queue
  console.log(`Job enqueued: ${type}`, payload);
  return "stub-job-id";
}
