import { prisma } from "../db/prisma";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Transaction } from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repository/ITransactionRepository";

export class TransactionRepositoryImpl
  extends BaseRepositoryImpl<Transaction>
  implements ITransactionRepository
{
  protected model = prisma.transaction;

  async findByExternalId(externalId: string): Promise<Transaction | null> {
    return this.model.findUnique({
      where: {
        externalId: externalId,
      },
    });
  }

  async getByWalletId(
    walletId: string,
    page = 1,
    limit = 10,
    method?: "stripe" | "razorpay",
    type?: "credited" | "debited"
  ): Promise<Transaction[]> {
    const skip = (page - 1) * limit;

    const whereClause: any = { walletId };
    if (method) whereClause.method = method;
    if (type) whereClause.type = type;

    return this.model.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
  }
}
