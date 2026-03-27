import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { IGetPurchasedArtWorksUseCase } from '../../interface/usecase/art/IGetPurchasedArtWorksUseCase';
import { toPurchaseHistoryResponse } from '../../mapper/artWithUserMapper';

@injectable()
export class GetPurchasedArtWorksUseCase implements IGetPurchasedArtWorksUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const purchasedList = await this._purchaseRepo.findByUserId(
      userId,
      page,
      limit,
    );
    if (!purchasedList || !purchasedList.length) return [];

    const artIds = [...new Set(purchasedList.map((p) => p.artId.toString()))];
    const sellerIds = [
      ...new Set(purchasedList.map((p) => p.sellerId.toString())),
    ];

    const [allArts, allSellers] = await Promise.all([
      this._artRepo.findByIds(artIds),
      this._userService.getUsersByIds(sellerIds),
    ]);

    const artMap = new Map(
      allArts
        .filter((a) => a && (a.id || a._id))
        .map((a) => [(a.id || a._id).toString(), a]),
    );

    const sellerMap = new Map(
      allSellers
        .filter((s) => s && (s.id || s._id))
        .map((s) => [(s.id || s._id).toString(), s]),
    );

    const result = purchasedList
      .map((purchase) => {
        const art = artMap.get(purchase.artId.toString());
        const seller = sellerMap.get(purchase.sellerId.toString());

        if (!art) {
          console.warn(`Art not found for ID: ${purchase.artId}`);
          return null;
        }

        return toPurchaseHistoryResponse(purchase, art, seller);
      })
      .filter((item) => item !== null);

    return result;
  }
}
