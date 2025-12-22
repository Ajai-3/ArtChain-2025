import axios from 'axios';
import { injectable } from 'inversify';
import { IWalletService } from '../../application/interface/http/IWalletService';

@injectable()
export class WalletService implements IWalletService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.WALLET_SERVICE_URL || 'http://localhost:4004';
  }

  async getAdminTransactions(
    adminId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    transactions: Array<{
      amount: number;
      category: string;
      description: string;
      createdAt: Date;
    }>;
  }> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const res = await axios.get(
        `${this.baseUrl}/api/v1/wallet/admin/${adminId}/transactions`,
        { params }
      );
      
      return { transactions: res.data.data || res.data.transactions || [] };
    } catch (err) {
      console.error('Error fetching admin transactions from wallet-service:', err);
      return { transactions: [] };
    }
  }
}
