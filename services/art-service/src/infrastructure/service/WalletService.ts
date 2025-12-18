import axios from "axios";
import { injectable } from "inversify";
import { config } from "../config/env";
import { IWalletService } from "../../domain/interfaces/IWalletService";

@injectable()
export class WalletService implements IWalletService {
  async processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    artId: string
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/purchase`,
        { buyerId, sellerId, amount, artId }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Error processing purchase:", error);
      return false;
    }
  }

  async lockFunds(userId: string, amount: number, auctionId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/lock`,
        { userId, amount, auctionId }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Error locking funds:", error);
      return false;
    }
  }

  async unlockFunds(userId: string, amount: number, auctionId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/unlock`,
        { userId, amount, auctionId }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Error unlocking funds:", error);
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
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/split-purchase`,
        { buyerId: winnerId, sellerId, adminId, totalAmount, commissionAmount, artId: auctionId }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Error settling auction:", error);
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
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/payment`,
        { payerId, payeeId, amount, description, referenceId, category }
      );
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Error processing payment:", error);
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
        `${config.api_gateway_url}/api/v1/wallet/transaction/commission/distribute`,
        params
      );
      return response.data.message === "Funds distributed successfully";
    } catch (error) {
      console.error("Error distributing commission funds:", error);
      return false;
    }
  }

  async refundCommissionFunds(params: {
    userId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/wallet/transaction/commission/refund`,
        params
      );
      return response.data.message === "Funds refunded successfully";
    } catch (error) {
      console.error("Error refunding commission funds:", error);
      return false;
    }
  }
}
