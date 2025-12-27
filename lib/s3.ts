/**
 * AWS S3 utilities for video storage and presigned URL generation.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "flowcut-videos";

/**
 * Upload a buffer to S3
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string = "video/mp4"
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `s3://${BUCKET_NAME}/${key}`;
}

/**
 * Generate a presigned URL for downloading a file from S3
 * URL expires in 1 hour by default
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
}

/**
 * Get the S3 key for a render job
 */
export function getRenderKey(jobId: string): string {
  return `renders/${jobId}.mp4`;
}
