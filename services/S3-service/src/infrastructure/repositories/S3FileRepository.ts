import { logger } from "../utils/logger";
import { FileCategory } from "../../types/FileCategory";
import { UploadResult } from "../../types/UploadResult";
import { getBucketConfig, s3Client } from "../config/s3";
import { generateFileName } from "../utils/generateFileName";
import { IFileRepository } from "../../domain/repositories/IFileRepository";

export class S3FileRepository implements IFileRepository {
  async upload(
    file: Buffer,
    originalName: string,
    mimeType: string,
    category: FileCategory,
    userId: string,
    previewBuffer?: Buffer,
    watermarkedBuffer?: Buffer
  ): Promise<UploadResult> {
    const bucketConfig = getBucketConfig(category);
    const keyBase = generateFileName(userId, originalName, category);

    try {
      if (category === "art") {
        if (!bucketConfig.privateBucket || !bucketConfig.publicBucket) {
          throw new Error("Art buckets not configured");
        }

        await s3Client.upload({
          Bucket: bucketConfig.privateBucket,
          Key: `art/${userId}/original_${keyBase}`,
          Body: file,
          ContentType: mimeType,
        }).promise();

        if (previewBuffer) {
          await s3Client.upload({
            Bucket: bucketConfig.publicBucket,
            Key: `art/${userId}/preview_${keyBase}`,
            Body: previewBuffer,
            ContentType: mimeType,
          }).promise();
        }

        if (watermarkedBuffer) {
          await s3Client.upload({
            Bucket: bucketConfig.publicBucket,
            Key: `art/${userId}/watermarked_${keyBase}`,
            Body: watermarkedBuffer,
            ContentType: mimeType,
          }).promise();
        }

        const publicPreviewUrl = previewBuffer
          ? `${getCdnDomain()}/art/${userId}/preview_${keyBase}`
          : undefined;

        const publicWatermarkedUrl = watermarkedBuffer
          ? `${getCdnDomain()}/art/${userId}/watermarked_${keyBase}`
          : undefined;

        const privateSignedUrl = s3Client.getSignedUrl("getObject", {
          Bucket: bucketConfig.privateBucket,
          Key: `art/${userId}/original_${keyBase}`,
          Expires: 3600,
        });

        logger.info(
          `✅ Art uploaded | privateBucket=${bucketConfig.privateBucket} | publicBucket=${bucketConfig.publicBucket} | key=${keyBase}`
        );

        return { privateSignedUrl, publicPreviewUrl, publicWatermarkedUrl };
      }

      if (!bucketConfig.bucket) throw new Error("Bucket not configured");

      await s3Client.upload({
        Bucket: bucketConfig.bucket,
        Key: keyBase,
        Body: file,
        ContentType: mimeType,
      }).promise();

      const publicUrl = `${getCdnDomain()}/${keyBase}`;
      logger.info(`✅ File uploaded | bucket=${bucketConfig.bucket} | key=${keyBase}`);

      return { publicUrl };
    } catch (err) {
      logger.error(`❌ Error uploading file ${keyBase}:`, err);
      throw err;
    }
  }

  async delete(fileUrl: string, category: FileCategory): Promise<void> {
    const bucketConfig = getBucketConfig(category);
    const key = fileUrl.split(`${getCdnDomain()}/`)[1];
    if (!key) throw new Error("Invalid file URL");

    try {
      if (category === "art") {
        await s3Client.deleteObject({ Bucket: bucketConfig.privateBucket!, Key: `art/${key}` }).promise();
        await s3Client.deleteObject({ Bucket: bucketConfig.publicBucket!, Key: `art/${key}` }).promise();
        logger.info(`✅ Art file deleted | key=${key}`);
        return;
      }

      await s3Client.deleteObject({ Bucket: bucketConfig.bucket!, Key: key }).promise();
      logger.info(`✅ File deleted | bucket=${bucketConfig.bucket} | key=${key}`);
    } catch (err) {
      logger.error(`❌ Error deleting file ${fileUrl}:`, err);
      throw err;
    }
  }
}

function getCdnDomain(): string {
  return process.env.AWS_CDN_DOMAIN || "https://your-cdn-domain.com";
}
