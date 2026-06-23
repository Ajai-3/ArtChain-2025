import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { IGetPurchasedArtWorksUseCase } from '../../interface/usecase/art/IGetPurchasedArtWorksUseCase';
import { toPurchaseHistoryResponse } from '../../mapper/artWithUserMapper';
import { PurchasedArtworksResponse } from '../../../types/usecase-response';
import type { ArtPostLike } from '../../../types/art-mapper';
import type { UserPublicProfile } from '../../../types/user';

@injectable()
export class GetPurchasedArtWorksUseCase implements IGetPurchasedArtWorksUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10): Promise<PurchasedArtworksResponse> {
    const purchasedList = await this._purchaseRepo.findByUserId(
      userId,
      page,
      limit,
    );
    if (!purchasedList || !purchasedList.length) return { purchases: [], total: 0 };

    const artIds = [...new Set(purchasedList.map((p) => p.artId?.toString() ?? '').filter(Boolean))];
    const sellerIds = [
      ...new Set(purchasedList.map((p) => p.sellerId?.toString() ?? '').filter(Boolean)),
    ];

    const [allArts, allSellers] = await Promise.all([
      this._artRepo.findByIds(artIds),
      this._userService.getUsersByIds(sellerIds),
    ]);

    const artMap = new Map<string, ArtPostLike>();
    for (const a of allArts) {
      if (a) {
        const key = a._id?.toString() ?? a.id ?? '';
        artMap.set(key, a);
      }
    }

    const sellerMap = new Map<string, UserPublicProfile>();
    for (const s of allSellers) {
      if (s) {
        sellerMap.set(s.id, s);
      }
    }

    const purchases = purchasedList
      .map((purchase) => {
        const artId = purchase.artId?.toString() ?? '';
        const sellerId = purchase.sellerId?.toString() ?? '';

        const art = artMap.get(artId) ?? null;
        const seller = sellerMap.get(sellerId) ?? null;

        if (!art) {
          console.warn(`Art not found for ID: ${purchase.artId}`);
          return null;
        }

        return toPurchaseHistoryResponse(purchase, art, seller);
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return { purchases, total: purchasedList.length };
  }
}
