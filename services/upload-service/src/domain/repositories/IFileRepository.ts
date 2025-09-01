export interface IFileRepository {
  upload(file: Buffer, filename: string, mimeType: string, category: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
}