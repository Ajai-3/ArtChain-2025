
import { inject, injectable } from "inversify";
import { ICancelAuctionUseCase } from "../../interface/usecase/auction/ICancelAuctionUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { NotFoundError, ValidationError } from "art-chain-shared";

@injectable()
export class CancelAuctionUseCase implements ICancelAuctionUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository)
    private readonly _auctionRepository: IAuctionRepository
  ) {}

  async execute(id: string): Promise<void> {
    const auction = await this._auctionRepository.getById(id);

    if (!auction) {
      throw new NotFoundError("Auction not found");
    }

    if (auction.status === "ENDED" || auction.status === "CANCELLED") {
      throw new ValidationError("Cannot cancel an auction that is already ended or cancelled");
    }

    await this._auctionRepository.updateStatus(id, "CANCELLED");
  }
}
