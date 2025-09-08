import { UploadResult } from "../../types/UploadResult";

export interface IFileRepository {
  upload(file: Buffer, filename: string, mimeType: string, category: string, userId:string): Promise<UploadResult>;
  delete(fileUrl: string, category: string): Promise<void>;
}