import { injectable } from "inversify";
import { prisma } from "../db/prisma";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { IWithdrawalRepository } from "../../domain/repository/IWithdrawalRepository";
import { WithdrawalRequest } from "../../domain/entities/WithdrawalRequest";
import { WithdrawalStatus } from "../../domain/entities/WithdrawalRequest";
import { TransactionType, TransactionCategory, TransactionMethod, TransactionStatus } from "../../domain/entities/Transaction";

@injectable()
export class WithdrawalRepositoryImpl
  extends BaseRepositoryImpl<WithdrawalRequest>
  implements IWithdrawalRepository
{
  protected model = prisma.withdrawalRequest;


  async getWithdrawalRequestById(id: string): Promise<WithdrawalRequest | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async getWithdrawalRequestsByUserId(userId: string, page: number, limit: number, status?: string, method?: string): Promise<{ requests: WithdrawalRequest[]; total: number }> {
     const skip = (page - 1) * limit;
     const where: any = { userId };
     
     if (status && status !== "all") {
        where.status = status;
     }

     if (method && method !== "all") {
        where.method = method;
     }

     const [requests, total] = await Promise.all([
        this.model.findMany({
           where,
           orderBy: { createdAt: "desc" },
           skip,
           take: limit
        }),
        this.model.count({ where })
     ]);

     return { requests: requests as any, total };
  }

  async getWithdrawalRequestsByWalletId(walletId: string): Promise<WithdrawalRequest[]> {
    return this.model.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateWithdrawalRequestStatus(
    id: string,
    status: string,
    transactionId?: string,
    rejectionReason?: string
  ): Promise<WithdrawalRequest> {
    // Use base repository update method
    return this.update(
      { id },
      {
        status: status as any,
        transactionId,
        rejectionReason,
        processedAt: new Date(),
      } as any
    );
  }

  async findAll(page: number, limit: number, status?: string, method?: string): Promise<{ requests: WithdrawalRequest[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status && status !== "ALL") {
        where.status = status;
    }

    const [requests, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.model.count({ where }),
    ]);
    return { requests: requests as any, total };
  }

  async updateStatus(
    id: string,
    status: string,
    rejectionReason?: string
  ): Promise<WithdrawalRequest> {
    return this.model.update({
      where: { id },
      data: {
        status: status as any,
        rejectionReason,
        processedAt: new Date(),
      },
    });
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    const counts = await this.model.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    counts.forEach((item) => {
      statusCounts[item.status] = item._count.status;
    });

    return statusCounts;
  }

  async processWithdrawal(params: {
    withdrawalId: string;
    status: string;
    amount: number;
    walletId: string;
    rejectionReason?: string;
    originalTransactionId?: string;
  }): Promise<WithdrawalRequest> {
    return prisma.$transaction(async (tx) => {
      // 1. Update the withdrawal request status
      const updatedWithdrawal = await tx.withdrawalRequest.update({
        where: { id: params.withdrawalId },
        data: {
          status: params.status as any,
          rejectionReason: params.rejectionReason,
          processedAt: new Date(),
        },
      });

      // 2. Handle balance updates based on target status
      if (params.status === WithdrawalStatus.APPROVED || 
          params.status === WithdrawalStatus.COMPLETED || 
          params.status === WithdrawalStatus.PROCESSING) {
        
        // Withdrawal moving out of PENDING: Remove money from lockedAmount
        await tx.wallet.updateMany({
          where: { 
            id: params.walletId, 
            lockedAmount: { gte: params.amount } 
          },
          data: {
            lockedAmount: { decrement: params.amount },
          },
        });

        // Sync original transaction status to SUCCESS
        if (params.originalTransactionId) {
          await tx.transaction.update({
            where: { id: params.originalTransactionId },
            data: { status: TransactionStatus.SUCCESS }
          });
        }
      } else if (params.status === WithdrawalStatus.REJECTED || params.status === WithdrawalStatus.FAILED) {
        // Withdrawal rejected/failed: Return money from lockedAmount to balance
        await tx.wallet.updateMany({
          where: { 
            id: params.walletId, 
            lockedAmount: { gte: params.amount } 
          },
          data: {
            balance: { increment: params.amount },
            lockedAmount: { decrement: params.amount },
          },
        });

        // Sync original transaction status to FAILED since withdrawal didn't proceed
        if (params.originalTransactionId) {
          await tx.transaction.update({
            where: { id: params.originalTransactionId },
            data: { status: TransactionStatus.FAILED }
          });
        }

        // 3. Create a refund transaction
        await tx.transaction.create({
          data: {
            walletId: params.walletId,
            type: TransactionType.CREDITED,
            category: TransactionCategory.REFUND,
            amount: params.amount,
            method: TransactionMethod.ART_COIN,
            status: TransactionStatus.SUCCESS,
            description: `Withdrawal ${params.status.toLowerCase()}: ${params.rejectionReason || "Technical failure"}`,
            meta: {
              withdrawalId: params.withdrawalId,
              originalTransactionId: params.originalTransactionId
            }
          },
        });
      }

      return updatedWithdrawal as unknown as WithdrawalRequest;
    });
  }
}
