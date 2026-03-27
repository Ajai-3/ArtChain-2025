import axios from 'axios';
import { inject, injectable } from 'inversify';
import { IWalletService } from '../../application/interface/http/IWalletService';
import { config } from '../config/env';
import { TYPES } from '../inversify/types';
import { ILogger } from '../../application/interface/ILogger';
import { ROUTES } from '../../constants/routes';

@injectable()
export class WalletService implements IWalletService {
  private baseUrl: string;

  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger) {
    this.baseUrl = config.api_gateway_URL;
  }

  async getAdminTransactions(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date,
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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { transactions: res.data.data || res.data.transactions || [] };
    } catch (err) {
      this._logger.error(
        'Error fetching admin transactions from wallet-service:',
        err,
      );
      return { transactions: [] };
    }
  }

  async getRecentTransactions(
    token: string,
    limit: number = 5,
  ): Promise<any[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.WALLET_TRANSACTIONS_RECENT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting recent transactions:', err);
      return [];
    }
  }

  async getTransactionStats(token: string): Promise<any[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.WALLET_TRANSACTIONS_STATS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting transaction stats:', err);
      return [];
    }
  }

  async getRevenueStats(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.WALLET_REVENUE_STATS}`,
        {
          params,
          headers: {
            'x-admin-id': adminId,
            'Authorization': `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error(
        'Error fetching revenue stats from wallet-service:',
        err,
      );
      return null;
    }
  }
}
