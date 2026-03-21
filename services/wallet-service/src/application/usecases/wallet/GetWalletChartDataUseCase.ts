import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import {
  IGetWalletChartDataUseCase,
  WalletChartData,
} from '../../interface/usecase/wallet/IGetWalletChartDataUseCase';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';
import { BadRequestError } from 'art-chain-shared';
import { WALLET_MESSAGES } from '../../../constants/WalletMessages';

@injectable()
export class GetWalletChartDataUseCase implements IGetWalletChartDataUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepo: IWalletRepository,
  ) {}

  async execute(
    userId: string,
    timeRange: '7d' | '1m' | 'all',
  ): Promise<WalletChartData> {
    const wallet = await this._walletRepo.getByUserId(userId);
    if (!wallet) throw new BadRequestError(WALLET_MESSAGES.WALLET_NOT_FOUND);

    let startDate: Date | undefined;
    const now = new Date();

    if (timeRange === '7d') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === '1m') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const dailyStats = await this._walletRepo.getDailyStats(
      wallet.id,
      startDate,
    );
    const categoryStats = await this._walletRepo.getCategoryStats(
      wallet.id,
      startDate,
    );

    let periodEarned = 0;
    let periodSpent = 0;
    let periodTxCount = 0;
    let netChangeInPeriod = 0;

    const dailyMap = new Map<string, { income: number; expense: number }>();
    const uniqueDates = new Set<string>();

    dailyStats.forEach((stat: any) => {
      const isCredit = stat.type === 'credited' && stat.category !== 'TOP_UP';
      const amount = Number(stat.total_amount);

      const dateKey =
        stat.date instanceof Date
          ? stat.date.toISOString().split('T')[0]
          : String(stat.date).split('T')[0];

      const current = dailyMap.get(dateKey) || { income: 0, expense: 0 };

      if (isCredit) {
        current.income += amount;
        periodEarned += amount;
        netChangeInPeriod += amount;
      } else if (stat.type === 'debited') {
        current.expense += amount;
        periodSpent += amount;
        netChangeInPeriod -= amount;
      }

      dailyMap.set(dateKey, current);
      periodTxCount += Number(stat.count_tx);
      uniqueDates.add(dateKey);
    });

    let balanceAtStart = wallet.balance - netChangeInPeriod;
    let runningBalance = balanceAtStart;

    const sortedDates = Array.from(uniqueDates).sort();

    const trendData = sortedDates.map((dateStr) => {
      const dayStats = dailyMap.get(dateStr)!;
      const dayNet = dayStats.income - dayStats.expense;

      runningBalance += dayNet;

      return {
        date: new Date(dateStr).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
        amount: parseFloat(runningBalance.toFixed(2)),
        value: dayNet,
        income: dayStats.income,
        expense: dayStats.expense,
      };
    });

    const earnedBreakdown = categoryStats
      .filter((s: any) => s.type === 'credited')
      .map((s: any) => ({
        name: s.category || 'Other',
        value: Number(s._sum.amount || 0),
      }));

    const spentBreakdown = categoryStats
      .filter((s: any) => s.type === 'debited')
      .map((s: any) => ({
        name: s.category || 'Other',
        value: Number(s._sum.amount || 0),
      }));

    const roiVal =
      periodSpent > 0 ? ((periodEarned - periodSpent) / periodSpent) * 100 : 0;

    return {
      trend: trendData,
      breakdown: { earned: earnedBreakdown, spent: spentBreakdown },
      stats: [
        { name: 'Earned', value: periodEarned },
        { name: 'Spent', value: periodSpent },
        {
          name: 'Avg Tx',
          value:
            periodTxCount > 0
              ? parseFloat(
                  ((periodEarned + periodSpent) / periodTxCount).toFixed(2),
                )
              : 0,
        },
        { name: 'ROI', value: parseFloat(roiVal.toFixed(2)) },
        { name: 'Grade', value: roiVal > 50 ? 'A' : roiVal > 20 ? 'B' : 'C' },
      ],
    };
  }
}
