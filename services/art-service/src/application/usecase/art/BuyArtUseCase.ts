import { inject, injectable } from "inversify";
import { IBuyArtUseCase } from "../../interface/usecase/art/IBuyArtUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { Purchase } from "../../../domain/entities/Purchase";
import { IPurchaseRepository } from "../../../domain/repositories/IPurchaseRepository";

import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";
import { config } from "../../../infrastructure/config/env";
import { BadRequestError, NotFoundError } from "art-chain-shared";

@injectable()
export class BuyArtUseCase implements IBuyArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _platformConfigRepo: IPlatformConfigRepository
  ) {}

  async execute(artId: string, buyerId: string): Promise<boolean> {
    const art = await this._artRepository.findById(artId);

    if (!art) {
      throw new NotFoundError("Art not found");
    }

    if (!art.isForSale) {
      throw new BadRequestError("Art is not for sale");
    }

    if (art.userId === buyerId) {
      throw new BadRequestError("You already own this art");
    }

    const price = art.artcoins || 0; // Assuming artcoins is the price
    if (price <= 0) {
        throw new BadRequestError("Invalid price");
    }

    // Calculate Platform Fee
    const platformConfig = await this._platformConfigRepo.getConfig();
    const feePercentage = platformConfig ? platformConfig.artSaleCommissionPercentage : 2;
    const platformFee = Math.round((price * feePercentage) / 100);

    // Process transaction
    const transactionSuccess = await this._walletService.processSplitPurchase(
      buyerId,
      art.userId,
      price,
      platformFee,
      artId
    );

    if (!transactionSuccess) {
      throw new Error("Transaction failed");
    }

    // Create Purchase Record
    const purchase = new Purchase(
      buyerId,
      artId,
      art.userId,
      price,
      `tx_${Date.now()}_${buyerId}` // Placeholder transaction ID
    );

    await this._purchaseRepo.create(purchase);

    // Update art status
    await this._artRepository.update(artId, {
      isForSale: false,
      isSold: true,
      status: "active",
      updatedAt: new Date(),
    });

    return true;
  }
}
