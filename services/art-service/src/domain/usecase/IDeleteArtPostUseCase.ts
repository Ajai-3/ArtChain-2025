export interface IDeleteArtPostUseCase {
  execute(id: string): Promise<void>;
}
