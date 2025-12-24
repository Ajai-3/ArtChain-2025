import { injectable, inject } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { IGetAllRecentTransactionsUseCase } from "../../interface/usecases/admin/IGetAllRecentTransactionsUseCase";

@injectable()
export class GetAllRecentTransactionsUseCase implements IGetAllRecentTransactionsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(limit: number): Promise<any[]> {
    return this._walletRepository.getAllRecentTransactions(limit);
  }
}
