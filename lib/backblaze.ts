// lib/backblaze.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.BACKBLAZE_REGION || "us-west-000",
  endpoint: `https://s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com`,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID!,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!,
  },
});

export async function uploadImageToBackblaze(
  file: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  const params = {
    Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
    Key: `products/${Date.now()}-${fileName}`, // Unique key with timestamp
    Body: file,
    ContentType: contentType,
    ACL: "public-read", // Make images publicly accessible
  };

  await s3Client.send(new PutObjectCommand(params));
  return `https://${process.env.BACKBLAZE_BUCKET_NAME}.s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com/${params.Key}`;
}
