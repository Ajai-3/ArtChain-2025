import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { CommissionStatus } from "../../../domain/entities/Commission";
import { IGetPlatformConfigUseCase } from "../../interface/usecase/admin/IGetPlatformConfigUseCase";

@injectable()
export class GetCommissionStatsUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository,
    @inject(TYPES.IGetPlatformConfigUseCase)
    private readonly _getPlatformConfigUseCase: IGetPlatformConfigUseCase
  ) {}

  async execute(): Promise<any> {
    // 1. Get all commissions (or aggregated stats from repo)
    const commissions = await this._commissionRepository.findAllFiltered({}, 1, 100000); // Fetch mostly all for stats, ideally repo should do aggregation

    const totalRequests = commissions.total;
    const completed = commissions.commissions.filter(c => c.status === CommissionStatus.COMPLETED).length;
    const disputed = commissions.commissions.filter(c => c.status === CommissionStatus.DISPUTE_RAISED).length;
    const inProgress = commissions.commissions.filter(c => c.status === CommissionStatus.IN_PROGRESS).length;

    // Calculate revenue from completed commissions
    // platformFee is stored in completed commissions
    const totalRevenue = commissions.commissions.reduce((sum, c) => sum + (c.platformFee || 0), 0);

    // Get current config
    const config = await this._getPlatformConfigUseCase.execute();

    return {
      totalRequests,
      completedRequests: completed,
      activeDisputes: disputed,
      inProgressRequests: inProgress,
      totalRevenue: totalRevenue,
      currentCommissionPercentage: config?.commissionArtPercentage || 0
    };
  }
}
