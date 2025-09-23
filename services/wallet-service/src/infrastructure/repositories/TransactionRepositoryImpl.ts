import { prisma } from "../db/prisma";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Transaction, TransactionCategory, TransactionMethod, TransactionStatus, TransactionType } from "../../domain/entities/Transaction";
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
  method?: TransactionMethod,
  type?: TransactionType,
  status?: TransactionStatus,
  category?: TransactionCategory
): Promise<{ transactions: Transaction[]; total: number }> {
  const skip = (page - 1) * limit;

  const whereClause: any = { walletId };
  if (method) whereClause.method = method;
  if (type) whereClause.type = type;
  if (category) whereClause.category = category;
  if (status) whereClause.status = status;

  const [transactions, total] = await Promise.all([
    this.model.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    this.model.count({ where: whereClause }),
  ]);

  return { transactions, total };
}


}
