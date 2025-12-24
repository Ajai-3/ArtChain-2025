import { Wallet } from "../entities/Wallet";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IWalletRepository extends IBaseRepository<Wallet> {
  getByUserId(userId: string): Promise<Wallet | null>;
  getTransactionStats(walletId: string): Promise<any>;
  getRecentTransactions(walletId: string, limit: number): Promise<any[]>;
  getTransactionsWithFilter(walletId: string, timeRange?: "7d" | "1m" | "all"): Promise<any[]>;
  getDailyStats(walletId: string, startDate?: Date): Promise<any[]>;
  getCategoryStats(walletId: string, startDate?: Date): Promise<any[]>;
  lockAmount(userId: string, amount: number): Promise<boolean>;
  unlockAmount(userId: string, amount: number): Promise<boolean>;
  settleAuctionFunds(winnerId: string, sellerId: string, adminId: string, totalAmount: number, commissionAmount: number, auctionId: string): Promise<boolean>;
  processSplitPurchase(buyerId: string, sellerId: string, adminId: string, totalAmount: number, commissionAmount: number, artId: string): Promise<boolean>;
  transferFunds(fromId: string, toId: string, amount: number, description: string, referenceId: string, category: string): Promise<boolean>;
  getRevenueStats(adminId: string, startDate?: Date, endDate?: Date): Promise<any>;
  getAdminCommissionTransactions(walletId: string, startDate?: Date, endDate?: Date): Promise<any[]>;
  getAllRecentTransactions(limit: number): Promise<any[]>;
  
  // Commission specific methods
  distributeCommissionFunds(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean>;
  
  lockCommissionFunds(userId: string, commissionId: string, amount: number): Promise<boolean>;
  
  refundCommissionFunds(userId: string, commissionId: string, amount: number): Promise<boolean>;
}