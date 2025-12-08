export interface IBuyArtUseCase {
  execute(artId: string, buyerId: string): Promise<boolean>;
}
