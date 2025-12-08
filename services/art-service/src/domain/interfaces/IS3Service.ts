export interface IS3Service {
  getSignedUrl(key: string, type: string): Promise<string>;
}
