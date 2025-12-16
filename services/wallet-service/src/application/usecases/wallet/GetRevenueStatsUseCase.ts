import { injectable, inject } from "inversify";
import { IGetRevenueStatsUseCase } from "../../interface/usecase/wallet/IGetRevenueStatsUseCase";
import { GetRevenueStatsDTO } from "../../interface/dto/wallet/GetRevenueStatsDTO";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";

@injectable()
export class GetRevenueStatsUseCase implements IGetRevenueStatsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: GetRevenueStatsDTO): Promise<any> {
    return this._walletRepository.getRevenueStats(
      dto.adminId,
      dto.startDate,
      dto.endDate
    );
  }
}
