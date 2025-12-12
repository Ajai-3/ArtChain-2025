import { Transaction } from "../../../../domain/entities/Transaction";

export interface IGetUserTransactionsUseCase {
  execute(
    walletId: string,
    page: number,
    limit: number,
    filters?: {
      type?: 'credited' | 'debited';
      category?: 'TOP_UP' | 'SALE' | 'PURCHASE' | 'WITHDRAWAL' | 'COMMISSION' | 'REFUND' | 'OTHER';
      status?: 'pending' | 'success' | 'failed';
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    data: Transaction[];
    meta: { total: number; page: number; limit: number };
  }>;
}
