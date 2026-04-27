import type { ShopArtByUserItem } from '../../../../types/shop';

export interface IGetShopArtsByUserUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<ShopArtByUserItem[]>;
}