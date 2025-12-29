import { inject, injectable } from "inversify";
import { IDistributeCommissionFundsUseCase } from "../../interface/usecase/transaction/IDistributeCommissionFundsUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";

@injectable()
export class DistributeCommissionFundsUseCase implements IDistributeCommissionFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean> {
    return this._walletRepository.distributeCommissionFunds(params);
  }
}
