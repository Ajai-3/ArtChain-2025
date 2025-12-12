export interface IDownloadArtUseCase {
  execute(artId: string, userId: string): Promise<string>;
}
