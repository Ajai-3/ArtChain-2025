import type { PurchasedArtworksResponse } from '../../../../types/usecase-response';

export interface IGetPurchasedArtWorksUseCase {
  execute(userId: string, page?: number, limit?: number): Promise<PurchasedArtworksResponse>;
}
