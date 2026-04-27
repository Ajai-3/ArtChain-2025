import { inject, injectable } from 'inversify';
import { NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ERROR_MESSAGES } from '../../../constants/ErrorMessages';
import { IUserService } from '../../interface/service/IUserService';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { ISaledArtworkOfuserUseCase } from '../../interface/usecase/art/ISaledArtworkOfuserUseCase';
import { toSaleHistoryResponse } from '../../mapper/artWithUserMapper';
import { SaledArtworksResponse } from '../../../types/usecase-response';
import type { ArtPostLike } from '../../../types/art-mapper';

@injectable()
export class SaledArtworkOfuserUseCase implements ISaledArtworkOfuserUseCase {
  constructor(
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(userId: string, page: number, limit: number): Promise<SaledArtworksResponse> {
    const user = await this._userService.getUserById(userId);
    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);

    const purchases = await this._purchaseRepo.findBySellerId(
      userId,
      page,
      limit,
    );
    if (!purchases || purchases.length === 0) return { sales: [], total: 0, length: 0 };

    const artIds = [...new Set(purchases.map((p) => p.artId).filter(Boolean))];
    const buyerIds = [
      ...new Set(purchases.map((p) => p.userId).filter(Boolean)),
    ];

    const [allArts, allBuyers] = await Promise.all([
      this._artRepo.findByIds(artIds),
      this._userService.getUsersByIds(buyerIds),
    ]);

    const artMap = new Map<string, ArtPostLike>();
    for (const art of allArts) {
      if (art) {
        const key = art._id?.toString() ?? art.id ?? '';
        artMap.set(key, art);
      }
    }

    const buyerMap = new Map<string, typeof allBuyers[number]>();
    for (const b of allBuyers) {
      if (b) {
        buyerMap.set(b.id, b);
      }
    }

    const sales = purchases.map((purchase) => {
      const purchaseArtId = purchase.artId?.toString();
      const purchaseBuyerId = purchase.userId?.toString();

      const art = purchaseArtId ? artMap.get(purchaseArtId) ?? null : null;
      const buyer = purchaseBuyerId ? buyerMap.get(purchaseBuyerId) ?? null : null;

      return toSaleHistoryResponse(purchase, art, buyer);
    });

    return { sales, length: purchases.length, total: purchases.length };
  }
}