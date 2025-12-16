import { injectable } from "inversify";
import axios from "axios";
import { IWalletService } from "../../domain/interfaces/IWalletService";
import { config } from "../config/env";

@injectable()
export class WalletService implements IWalletService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_url;
  }

  async processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    artId: string
  ): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/wallet/transaction/purchase`, {
        buyerId,
        sellerId,
        amount,
        artId,
      });
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(
        `Failed to process purchase for art ${artId}: ${error.message}`
      );
      return false;
    }
  }

  async lockFunds(userId: string, amount: number, auctionId: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/wallet/lock`, { userId, amount, auctionId });
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(`Failed to lock funds for user ${userId}: ${error.message}`);
      return false;
    }
  }

  async unlockFunds(userId: string, amount: number, auctionId: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/wallet/unlock`, { userId, amount, auctionId });
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(`Failed to unlock funds for user ${userId}: ${error.message}`);
      return false;
    }
  }

  async settleAuction(
    winnerId: string,
    sellerId: string,
    adminId: string,
    totalAmount: number,
    commissionAmount: number,
    auctionId: string
  ): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/wallet/settle-auction`, {
        winnerId,
        sellerId,
        adminId,
        totalAmount,
        commissionAmount,
        auctionId
      });
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(`Failed to settle auction ${auctionId}: ${error.message}`);
      return false;
    }
  }

  async processPayment(
    payerId: string,
    payeeId: string,
    amount: number,
    description: string,
    referenceId: string,
    category: string
  ): Promise<boolean> {
    try {
      // NOTE: Ensure api-gateway has this route forwarded to wallet-service
      // Or call wallet-service directly if internal
      const response = await axios.post(`${this.baseUrl}/api/v1/wallet/transaction/payment`, {
        payerId,
        payeeId,
        amount,
        description,
        referenceId,
        category
      });
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error(`Failed to process payment for ref ${referenceId}: ${error.message}`);
      return false;
    }
  }
}
