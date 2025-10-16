export interface IGetShopArtsByUserUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<any[]>;
}