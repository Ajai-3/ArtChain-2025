import { Wallet } from "../entities/Wallet";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IWalletRepository extends IBaseRepository<Wallet> {
  getByUserId(userId: string): Promise<Wallet | null>;
  getTransactionStats(walletId: string): Promise<any>;
  getRecentTransactions(walletId: string, limit: number): Promise<any[]>;
  lockAmount(userId: string, amount: number): Promise<boolean>;
  unlockAmount(userId: string, amount: number): Promise<boolean>;
}