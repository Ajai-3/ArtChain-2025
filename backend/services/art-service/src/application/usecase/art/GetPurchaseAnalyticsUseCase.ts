import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { IGetPurchaseAnalyticsUseCase } from '../../interface/usecase/art/IGetPurchaseAnalyticsUseCase';

interface TimelineItem {
  _id: string;
  count: number;
  totalSpent: number;
}

@injectable()
export class GetPurchaseAnalyticsUseCase implements IGetPurchaseAnalyticsUseCase {
    constructor(
        @inject(TYPES.IPurchaseRepository)
        private readonly _purchaseRepo: IPurchaseRepository
    ) { }

    async execute(userId: string, range: string = '7d') {
        const endDate = new Date();
        let startDate = new Date();

        if (range === 'today') {
            startDate.setHours(0, 0, 0, 0);
        } else if (range === '7d') {
            startDate.setDate(endDate.getDate() - 7);
        } else if (range === '30d') {
            startDate.setDate(endDate.getDate() - 30);
        } else {
            startDate = new Date(0);
        }

        const rawData = await this._purchaseRepo.getPurchaseAnalytics(userId, startDate, endDate);

        const result = rawData[0];

        const stats = result?.stats?.[0] || { totalSpent: 0, totalItems: 0 };
        const timeline = (result?.timeline || []) as TimelineItem[];

        return {
            totalPurchases: stats.totalItems,
            totalAmount: stats.totalSpent,
            purchaseTrend: timeline.map((item) => ({
                date: item._id,
                count: item.count,
                amount: item.totalSpent
            }))
        };
    }
}