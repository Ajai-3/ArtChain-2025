import { injectable, inject } from "inversify";
import { IGetAuctionStatsUseCase } from "../../interface/usecase/auction/IGetAuctionStatsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";

@injectable()
export class GetAuctionStatsUseCase implements IGetAuctionStatsUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository
  ) {}

  async execute(): Promise<{
    total: number;
    active: number;
    scheduled: number;
    ended: number;
    cancelled: number;
  }> {
    return await this._repository.getStats();
  }
}
