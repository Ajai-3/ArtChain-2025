import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { IWalletService } from '../../domain/interfaces/IWalletService';
import { SERVICE_ROUTES } from '../../constants/ServiceMessages';

@injectable()
export class WalletService implements IWalletService {
  async processSplitPurchase(
    buyerId: string,
    sellerId: string,
    totalAmount: number,
    commissionAmount: number,
    artId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_SPLIT_PURCHASE}`,
        { buyerId, sellerId, totalAmount, commissionAmount, artId },
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async lockFunds(
    userId: string,
    amount: number,
    auctionId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_LOCK}`,
        { userId, amount, auctionId },
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async unlockFunds(
    userId: string,
    amount: number,
    auctionId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_UNLOCK}`,
        { userId, amount, auctionId },
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async settleAuction(
    winnerId: string,
    sellerId: string,
    totalAmount: number,
    commissionAmount: number,
    auctionId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_SETTLE_AUCTION}`,
        { winnerId, sellerId, totalAmount, commissionAmount, auctionId },
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async processPayment(
    userId: string,
    payeeId: string,
    amount: number,
    description: string,
    referenceId: string,
    type: string,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_PROCESS_PAYMENT}`,
        { userId, payeeId, amount, description, referenceId, type },
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async distributeCommissionFunds(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_DISTRIBUTE}`,
        params,
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async refundCommissionFunds(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_REFUND}`,
        params,
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }

  async getBalance(userId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_BALANCE(userId)}`,
      );
      return response.data.data?.balance ?? 0;
    } catch (error) {
      return 0;
    }
  }

  async getTransactionHistory(
    userId: string,
  ): Promise<Array<{ type: string; amount: number; date: string }>> {
    try {
      const response = await axios.get(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_HISTORY(userId)}`,
      );
      return response.data.data ?? [];
    } catch (error) {
      return [];
    }
  }

  async transferLockedCommissionFunds(params: {
    fromUserId: string;
    toUserId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.WALLET_TRANSFER_LOCKED_COMMISSION}`,
        params,
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      return false;
    }
  }
}