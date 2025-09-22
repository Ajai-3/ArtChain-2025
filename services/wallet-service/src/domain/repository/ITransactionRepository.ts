import { IBaseRepository } from "./IBaseRepository";
import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  getByWalletId(
    walletId: string,
    page?: number,
    limit?: number,
    method?: string,
    type?: string
  ): Promise<Transaction[]>;
}