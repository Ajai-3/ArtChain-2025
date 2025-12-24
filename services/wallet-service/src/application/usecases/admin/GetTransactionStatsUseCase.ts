import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { ITransactionRepository } from "../../../domain/repository/ITransactionRepository";
import { IGetTransactionStatsUseCase } from "../../interface/usecase/admin/IGetTransactionStatsUseCase";

@injectable()
export class GetTransactionStatsUseCase implements IGetTransactionStatsUseCase {
  constructor(
    @inject(TYPES.ITransactionRepository)
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async execute(timeRange: string): Promise<any> {
    const endDate = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0); // Start of today
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'all':
        startDate = new Date(0); // Epoch
        break;
      default:
        startDate.setDate(endDate.getDate() - 7); // Default to 7d
    }

    return await this._transactionRepository.getStats(startDate, endDate);
  }
}
