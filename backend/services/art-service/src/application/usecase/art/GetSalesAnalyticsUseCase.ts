import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { IGetSalesAnalyticsUseCase } from '../../interface/usecase/art/IGetSalesAnalyticsUseCase';

@injectable()
export class GetSalesAnalyticsUseCase implements IGetSalesAnalyticsUseCase {
  constructor(
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(userId: string, range: string = '7d') {
    const endDate = new Date();
    let startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7d') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (range === '30d') {
      startDate.setDate(endDate.getDate() - 30);
    } else if (range === 'all') {
      startDate = new Date(0);
    }

    return await this._purchaseRepo.getSalesAnalytics(
      userId,
      startDate,
      endDate,
    );
  }
}
