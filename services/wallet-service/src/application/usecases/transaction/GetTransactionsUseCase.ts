import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { GetTransactionsDto } from "../../interface/dto/transaction/GetTransactionsDto";
import { ITransactionRepository } from "../../../domain/repository/ITransactionRepository";
import { IGetTransactionsUseCase } from "../../interface/usecase/transaction/IGetTransactionsUseCase";

@injectable()
export class GetTransactionsUseCase implements IGetTransactionsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepo: IWalletRepository,
    @inject(TYPES.ITransactionRepository)
    private readonly _transactionRepo: ITransactionRepository
  ) {}

  async execute(data: GetTransactionsDto) {
    const { userId, page, limit, method, type, status, category } = data;

    if (!userId) {
      throw new BadRequestError(WALLET_MESSAGES.USER_ID_MISSING);
    }

    const wallet = await this._walletRepo.getByUserId(userId);
    if (!wallet) {
      throw new NotFoundError(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    const { transactions, total } = await this._transactionRepo.getByWalletId(
      wallet.id,
      page,
      limit,
      method,
      type,
      status,
      category
    );

    return {
      transactions,
      total,
      page,
      limit,
    };
  }
}
