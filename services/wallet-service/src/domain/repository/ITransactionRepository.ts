import { IBaseRepository } from "./IBaseRepository";
import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  findByExternalId(externalId: string): Promise<Transaction | null>
  getByWalletId(
    walletId: string,
    page?: number,
    limit?: number,
    method?: string,
    type?: string
  ): Promise<Transaction[]>;
}
