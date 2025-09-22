import { FileCategory } from "../../types/FileCategory";

export interface UploadFileDTO {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  userId: string;
  previousFileUrl?: string;
  category: FileCategory;
}
