export interface ICountArtWorkUseCase {
  execute(userId: string): Promise<number>;
}
