import { S3 } from 'aws-sdk';
import { IFileRepository } from '../../domain/repositories/IFileRepository';

export class S3FileRepository implements IFileRepository {
  private s3 = new S3();

  async upload(file: Buffer, filename: string, mimeType: string, category: string): Promise<string> {
    const key = `${category}/${Date.now()}-${filename}`;

    const result = await this.s3.upload({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: file,
      ContentType: mimeType
    }).promise();

    return result.Location; // CDN URL
  }

  async delete(fileUrl: string): Promise<void> {
    // parse key from URL and delete
  }
}