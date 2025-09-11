export interface UploadFileDTO {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  userId: string;
  previousFileUrl?: string;
}
