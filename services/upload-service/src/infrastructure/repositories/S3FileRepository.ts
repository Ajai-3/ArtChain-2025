import { getBucketConfig, s3Client } from "../config/s3";
import { logger } from "../utils/logger";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { generateFileName } from "../utils/generateFileName";
import { FileCategory } from "../../types/FileCategory";

export class S3FileRepository implements IFileRepository {
  async upload(
    file: Buffer,
    originalName: string,
    mimeType: string,
    category: FileCategory,
    userId: string
  ): Promise<string> {
    const { bucket, acl } = getBucketConfig(category);
    const key = generateFileName(userId, originalName, category);

    try {
      await s3Client
        .upload({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: mimeType,
          ACL: acl,
        })
        .promise();

      const cdnUrl = `${getCdnDomain()}/${key}`;
      logger.info(`✅ File uploaded | bucket=${bucket} | key=${key} | url=${cdnUrl} | ACL=${acl}`);
      return cdnUrl;
    } catch (err) {
      logger.error(`❌ Error uploading file ${key} to bucket ${bucket}:`, err);
      throw err;
    }
  }

  async delete(fileUrl: string, category: FileCategory): Promise<void> {
    try {
      const { bucket } = getBucketConfig(category);
      const key = fileUrl.split(`${getCdnDomain()}/`)[1];

      await s3Client.deleteObject({ Bucket: bucket, Key: key! }).promise();
      logger.info(`✅ File deleted | bucket=${bucket} | key=${key}`);
    } catch (err) {
      logger.error(`❌ Error deleting file ${fileUrl} from bucket ${category}:`, err);
      throw err;
    }
  }
}


function getCdnDomain(): string {
  return process.env.AWS_CDN_DOMAIN || "https://your-cdn-domain.com";
}