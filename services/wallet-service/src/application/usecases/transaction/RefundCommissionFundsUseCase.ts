import { inject, injectable } from "inversify";
import { IRefundCommissionFundsUseCase } from "../../interface/usecase/transaction/IRefundCommissionFundsUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";

@injectable()
export class RefundCommissionFundsUseCase implements IRefundCommissionFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string, commissionId: string, amount: number): Promise<boolean> {
    return this._walletRepository.refundCommissionFunds(userId, commissionId, amount);
  }
}
