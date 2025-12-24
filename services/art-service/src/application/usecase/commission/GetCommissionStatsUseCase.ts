import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { IGetCommissionStatsUseCase } from "../../interface/usecase/commission/IGetCommissionStatsUseCase";

import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";

@injectable()
export class GetCommissionStatsUseCase implements IGetCommissionStatsUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository) private _repository: ICommissionRepository,
    @inject(TYPES.IPlatformConfigRepository) private _configRepository: IPlatformConfigRepository
  ) {}

  async execute(timeRange: string = '7d'): Promise<{
    REQUESTED: number;
    NEGOTIATING: number;
    AGREED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
    REJECTED: number;
    totalRevenue: number;
    activeDisputes: number;
    totalRequests: number;
    completedRequests: number;
    inProgressRequests: number;
    currentCommissionPercentage: number;
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

    const [stats, config] = await Promise.all([
        this._repository.getStats(startDate, startDate ? endDate : undefined),
        this._configRepository.getConfig()
    ]);

    const totalRequests = 
        stats.REQUESTED + 
        stats.NEGOTIATING + 
        stats.AGREED + 
        stats.IN_PROGRESS + 
        stats.COMPLETED + 
        stats.CANCELLED + 
        stats.REJECTED;

    return {
        ...stats,
        totalRequests,
        completedRequests: stats.COMPLETED,
        inProgressRequests: stats.IN_PROGRESS,
        currentCommissionPercentage: config ? config.commissionArtPercentage : 0
    };
  }
}
