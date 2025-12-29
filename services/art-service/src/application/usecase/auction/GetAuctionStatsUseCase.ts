import { injectable, inject } from "inversify";
import { IGetAuctionStatsUseCase } from "../../interface/usecase/auction/IGetAuctionStatsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";

@injectable()
export class GetAuctionStatsUseCase implements IGetAuctionStatsUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository
  ) {}

  async execute(timeRange: string = '7d'): Promise<{
    active: number;
    ended: number;
    sold: number;
    unsold: number;
  }> {
    const endDate = new Date();
    let startDate: Date | undefined;

    switch (timeRange) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'all':
        startDate = undefined;
        break;
      default:
        startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
    }

    return await this._repository.getStats(
        startDate, 
        startDate ? endDate : undefined
    );
  }
}
