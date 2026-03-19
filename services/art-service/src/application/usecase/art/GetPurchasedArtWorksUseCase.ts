import { inject, injectable } from 'inversify';
import { mapCdnUrl } from '../../../utils/mapCdnUrl';
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
    @inject(TYPES.IArtPostRepository) private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IPurchaseRepository) private readonly _purchaseRepo: IPurchaseRepository,
  ) { }

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const purchasedList = await this._purchaseRepo.findByUserId(userId, page, limit);
    if (!purchasedList.length) return [];

    const artIds = [...new Set(purchasedList.map((p) => p.artId))];
    const sellerIds = [...new Set(purchasedList.map((p) => p.sellerId))];

    const [allArts, allSellers] = await Promise.all([
      this._artRepo.findByIds(artIds),
      this._userService.getUsersByIds(sellerIds),
    ]);

    const artMap = new Map(allArts.map(a => [a.id.toString(), a]));
    const sellerMap = new Map(allSellers.map(s => [s.id.toString(), s]));

    return purchasedList.map((purchase) => {
      const art = artMap.get(purchase.artId.toString());
      const seller = sellerMap.get(purchase.sellerId.toString());

      if (!art) return null;

     return toPurchaseHistoryResponse(purchase, art, seller);
    }).filter(item => item !== null);
  }
}