import { inject, injectable } from "inversify";
import { ILockCommissionFundsUseCase } from "../../interface/usecase/transaction/ILockCommissionFundsUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";

@injectable()
export class LockCommissionFundsUseCase implements ILockCommissionFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string, commissionId: string, amount: number): Promise<boolean> {
    return this._walletRepository.lockCommissionFunds(userId, commissionId, amount);
  }
}
