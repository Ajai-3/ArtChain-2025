import { PurchaseAnalyticsRaw } from '../../application/interface/usecase/art/IGetPurchaseAnalyticsUseCase';
import { Purchase } from '../entities/Purchase';

export interface IPurchaseRepository {
  create(purchase: Purchase): Promise<Purchase>;
  findByArtId(artId: string): Promise<Purchase | null>;
  findBySellerId(
    sellerId: string,
    page: number,
    limit: number,
  ): Promise<Purchase[]>;
  findByUserAndArt(userId: string, artId: string): Promise<Purchase | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<Purchase[]>;
  getSalesAnalytics(
    sellerId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<{ date: string; totalAmount: number; count: number }[]>;
  getPurchaseAnalytics(
    userId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<PurchaseAnalyticsRaw[]>;
}
