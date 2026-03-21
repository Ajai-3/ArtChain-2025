export interface IDownloadArtUseCase {
  execute(id: string, userId: string, category: string): Promise<string>;
}
