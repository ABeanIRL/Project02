import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (
  !process.env.R2_BUCKET_NAME ||
  !process.env.R2_ENDPOINT ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  console.error(
    "Missing required environment variables. Please check your configuration."
  );
  process.exit(1);
}

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

console.log("S3 client initialized with R2 endpoint:", process.env.R2_ENDPOINT);
