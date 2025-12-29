import { prisma } from "../db/prisma";
import { injectable } from "inversify";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { ITransactionRepository } from "../../domain/repository/ITransactionRepository";
import { Transaction, TransactionCategory, TransactionMethod, TransactionStatus, TransactionType } from "../../domain/entities/Transaction";

@injectable()
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


async getStats(startDate: Date, endDate: Date): Promise<any[]> {
    const transactions = await this.model.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: TransactionStatus.SUCCESS
      },
      select: {
        createdAt: true,
        amount: true,
        type: true,
        status: true 
      }
    });

    const dailyStats: Record<string, { date: string, earned: number, spent: number }> = {};

    transactions.forEach(t => {
       const date = t.createdAt.toISOString().split('T')[0];
       if (!dailyStats[date]) dailyStats[date] = { date, earned: 0, spent: 0 };

       const amt = Number(t.amount);
       if (t.type === TransactionType.CREDITED) dailyStats[date].earned += amt;
       else dailyStats[date].spent += amt; 
    });

    return Object.values(dailyStats)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
}
