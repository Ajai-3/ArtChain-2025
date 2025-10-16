import { FileCategory } from "../../../types/FileCategory";

export interface UploadedFileDTO {
  url?: string;
  hash?: string;
  userId: string;
  type: FileCategory;
  nsfwScore?: number;
  previewUrl?: string;
  originalUrl?: string;
  downloadUrl?: string;
  watermarkedUrl?: string;
}
