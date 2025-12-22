import { injectable } from "inversify";
import { prisma } from "../db/prisma";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { IWithdrawalRepository } from "../../domain/repository/IWithdrawalRepository";
import { WithdrawalRequest } from "../../domain/entities/WithdrawalRequest";
import { CreateWithdrawalRequestDTO } from "../../application/interface/dto/withdrawal/CreateWithdrawalRequestDTO";

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
}
