import { Wallet } from "../entities/Wallet";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IWalletRepository extends IBaseRepository<Wallet> {
  getByUserId(userId: string): Promise<Wallet | null>;
}