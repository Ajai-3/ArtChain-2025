import axios from 'axios';
import { injectable } from 'inversify';
import { IWalletService } from '../../application/interface/http/IWalletService';
import { config } from '../config/env';

@injectable()
export class WalletService implements IWalletService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_URL;
  }

  async getAdminTransactions(
    adminId: string,
    token: string,
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
        { 
          params,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return { transactions: res.data.data || res.data.transactions || [] };
    } catch (err) {
      console.error('Error fetching admin transactions from wallet-service:', err);
      return { transactions: [] };
    }
  }

  async getRecentTransactions(token: string, limit: number = 5): Promise<any[]> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/wallet/admin/transactions/recent`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit }
      });
      return res.data.data;
    } catch (err) {
      console.error('Error getting recent transactions:', err);
      return [];
    }
  }

  async getTransactionStats(token: string): Promise<any[]> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/wallet/admin/transactions/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      console.error('Error getting transaction stats:', err);
      return [];
    }
  }

  async getRevenueStats(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const res = await axios.get(`${this.baseUrl}/api/v1/wallet/admin/revenue-stats`, {
        params,
        headers: {
          'x-admin-id': adminId,
          'Authorization': `Bearer ${token}`
        }
      });
      return res.data.data;
    } catch (err) {
      console.error('Error fetching revenue stats from wallet-service:', err);
      return null;
    }
  }
}
