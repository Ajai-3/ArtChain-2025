import { BadRequestError, NotFoundError } from "art-chain-shared";
import { GetTransactionsDto } from "../../../domain/dto/transaction/GetTransactionsDto";
import { ITransactionRepository } from "../../../domain/repository/ITransactionRepository";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { IGetTransactionsUseCase } from "../../../domain/usecase/transaction/IGetTransactionsUseCase";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";

export class GetTransactionsUseCase implements IGetTransactionsUseCase {
  constructor(private readonly _walletRepo: IWalletRepository, private readonly _transactionRepo: ITransactionRepository) {}

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
