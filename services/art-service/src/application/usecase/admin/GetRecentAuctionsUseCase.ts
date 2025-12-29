import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IGetRecentAuctionsUseCase } from "../../interface/usecase/admin/IGetRecentAuctionsUseCase";
import { Auction } from "../../../domain/entities/Auction";

@injectable()
export class GetRecentAuctionsUseCase implements IGetRecentAuctionsUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository
  ) {}

  async execute(limit: number): Promise<Auction[]> {
    return this._repository.findRecent(limit);
  }
}
