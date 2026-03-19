export interface IGetPurchasedArtWorksUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<any>;
}
