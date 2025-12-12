import { inject, injectable } from "inversify";
import { IBuyArtUseCase } from "../../interface/usecase/art/IBuyArtUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IWalletService } from "../../../domain/interfaces/IWalletService";

@injectable()
export class BuyArtUseCase implements IBuyArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService
  ) {}

  async execute(artId: string, buyerId: string): Promise<boolean> {
    const art = await this._artRepository.findById(artId);

    if (!art) {
      throw new Error("Art not found");
    }

    if (!art.isForSale) {
      throw new Error("Art is not for sale");
    }

    if (art.userId === buyerId) {
      throw new Error("You already own this art");
    }

    const price = art.artcoins || 0; // Assuming artcoins is the price
    if (price <= 0) {
        throw new Error("Invalid price");
    }

    // Process transaction
    const transactionSuccess = await this._walletService.processPurchase(
      buyerId,
      art.userId,
      price,
      artId
    );

    if (!transactionSuccess) {
      throw new Error("Transaction failed");
    }

    // Update art ownership
    await this._artRepository.update(artId, {
      ownerId: buyerId,
      isForSale: false,
      postType: "purchased",
      updatedAt: new Date(),
    });

    return true;
  }
}
