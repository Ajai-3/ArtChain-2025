export interface IFileRepository {
  upload(file: Buffer, filename: string, mimeType: string, category: string, userId:string): Promise<string>;
  delete(fileUrl: string, category: string): Promise<void>;
}