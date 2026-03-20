export interface IS3Service {
  getSignedUrl(key: string, type: string, fileName: string): Promise<string>;
}
