import { injectable } from 'inversify';
import { Purchase } from '../../domain/entities/Purchase';
import { IPurchaseRepository } from '../../domain/repositories/IPurchaseRepository';
import { BaseRepositoryImpl } from './BaseRepositoryImpl';
import { PurchaseModel } from '../models/PurchaseModel';
import type { MongoQuery } from '../../types/mongo';

@injectable()
export class PurchaseRepositoryImpl
  extends BaseRepositoryImpl<Purchase>
  implements IPurchaseRepository
{
  constructor() {
    super(PurchaseModel);
  }

  async findByUserAndArt(
    userId: string,
    artId: string,
  ): Promise<Purchase | null> {
    const purchase = await PurchaseModel.findOne({ userId, artId });
    return purchase ? purchase.toObject() : null;
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Purchase[]> {
    const purchases = await PurchaseModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return purchases.map((p) => p.toObject());
  }

  async findBySellerId(
    sellerId: string,
    page: number,
    limit: number,
  ): Promise<Purchase[]> {
    const sales = await PurchaseModel.find({ sellerId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return sales.map((p) => p.toObject());
  }

  async findByArtId(artId: string): Promise<Purchase | null> {
    const purchase = await PurchaseModel.findOne({ artId });
    return purchase ? purchase.toObject() : null;
  }

  async getSalesAnalytics(
    sellerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ date: string; totalAmount: number; count: number }[]> {
    const matchQuery: MongoQuery = { sellerId };

    if (startDate || endDate) {
      matchQuery.purchaseDate = {};
      if (startDate) matchQuery.purchaseDate.$gte = startDate.toISOString();
      if (endDate) matchQuery.purchaseDate.$lte = endDate.toISOString();
    }

    return await PurchaseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' } },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalAmount: 1,
          count: 1,
        },
      },
    ]);
  }

  async getPurchaseAnalytics(userId: string, startDate: Date, endDate: Date) {
    return await PurchaseModel.aggregate([
      {
        $match: {
          userId: userId,
          purchaseDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $facet: {
          timeline: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' },
                },
                totalSpent: { $sum: '$amount' },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          stats: [
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);
  }
}
