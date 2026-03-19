import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { IGetPurchasedArtWorksUseCase } from '../../interface/usecase/art/IGetPurchasedArtWorksUseCase';

@injectable()
export class GetPurchasedArtWorksUseCase implements IGetPurchasedArtWorksUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository) private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IPurchaseRepository) private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const purchasedList = await this._purchaseRepo.findByUserId(userId, page, limit);

    if (!purchasedList.length) return [];

    const artIds = purchasedList.map((p) => p.artId);
    const sellerIds = Array.from(new Set(purchasedList.map((p) => p.sellerId)));

    const [allArts, allSellers] = await Promise.all([
      this._artRepo.findByIds(artIds),
      this._userService.getUsersByIds(sellerIds),
    ]);

    return purchasedList.map((purchase) => {
      const art = allArts.find((a) => a.id === purchase.artId);
      const seller = allSellers.find((s) => s.id === purchase.sellerId);

      if (!art) return null;

      return {
        ...art.toJSON(),
        seller: {
          id: seller.id,
          name: seller.name,
          username: seller.username,
          profileImage: seller.profileImage,
        },
        purchaseAmount: purchase.amount,
        purchasedAt: purchase.purchaseDate,
      };
    }).filter(item => item !== null); 
  }
}