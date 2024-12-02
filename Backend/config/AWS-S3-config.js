import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
