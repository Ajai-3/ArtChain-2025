import { UploadResult } from "../../types/UploadResult";
import { FileCategory } from "../../types/FileCategory";

export interface IFileRepository {
  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
    category: FileCategory,
    userId: string,
    previewBuffer?: Buffer,
    watermarkedBuffer?: Buffer
  ): Promise<UploadResult>;

  delete(fileUrl: string, category: FileCategory): Promise<void>;
  getSignedUrl(key: string, category: FileCategory): Promise<string>;
}
