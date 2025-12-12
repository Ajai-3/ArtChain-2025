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
}
