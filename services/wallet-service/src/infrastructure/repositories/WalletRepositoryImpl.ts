import { prisma } from "../db/prisma";
import { Wallet } from "../../domain/entities/Wallet";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { IWalletRepository } from "../../domain/repository/IWalletRepository.js";

export class WalletRepositoryImpl extends BaseRepositoryImpl<Wallet> implements IWalletRepository {
  protected model = prisma.wallet;

  getByUserId(userId: string) {
    return this.model.findUnique({ where: { userId }, include: { transactions: true } });
  }
}