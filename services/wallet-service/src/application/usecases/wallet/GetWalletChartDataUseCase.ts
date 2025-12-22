import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IGetWalletChartDataUseCase, WalletChartData } from "../../interface/usecase/wallet/IGetWalletChartDataUseCase";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { BadRequestError } from "art-chain-shared";

@injectable()
export class GetWalletChartDataUseCase implements IGetWalletChartDataUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepo: IWalletRepository
  ) {}

  async execute(userId: string, timeRange: "7d" | "1m" | "all"): Promise<WalletChartData> {
    const wallet = await this._walletRepo.getByUserId(userId);
    if (!wallet) throw new BadRequestError("Wallet not found");

    let startDate: Date | undefined;
    const now = new Date();

    if (timeRange === "7d") {
       startDate = new Date();
       startDate.setDate(now.getDate() - 7);
       startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "1m") {
       startDate = new Date();
       startDate.setMonth(now.getMonth() - 1);
       startDate.setHours(0, 0, 0, 0);
    }

    const dailyStats = await this._walletRepo.getDailyStats(wallet.id, startDate);
    const categoryStats = await this._walletRepo.getCategoryStats(wallet.id, startDate);

    
    let totalChangeInPeriod = 0;
    
    let periodEarned = 0;
    let periodSpent = 0;
    let periodTxCount = 0;

    const dailyMap = new Map<string, { net: number; income: number; expense: number }>(); 
    const uniqueDates = new Set<string>();

    dailyStats.forEach((stat: any) => {
        const amount = Number(stat.total_amount); 
        const count = Number(stat.count_tx);
        
        let dateKey: string;
        if (stat.date instanceof Date) {
            dateKey = stat.date.toISOString().split('T')[0];
        } else {
            dateKey = String(stat.date).split('T')[0];
        }
        
        const isCredit = stat.type === "credited" || stat.type === "Earned";

        const current = dailyMap.get(dateKey) || { net: 0, income: 0, expense: 0 };
        
        if (isCredit) {
             totalChangeInPeriod += amount;
             periodEarned += amount;
             current.net += amount;
             current.income += amount;
        } else {
             totalChangeInPeriod -= amount; 
             periodSpent += amount;
             current.net -= amount;
             current.expense += amount;
        }
        dailyMap.set(dateKey, current);

        periodTxCount += count;
        uniqueDates.add(dateKey); 
    });

    let runningBalance = wallet.balance - totalChangeInPeriod; 
    
    const sortedDates = Array.from(uniqueDates).sort();
    
    const trendData = sortedDates.map(dateStr => {
        const dateObj = new Date(dateStr);
        const displayDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        
        const dayStats = dailyMap.get(dateStr) || { net: 0, income: 0, expense: 0 };
        runningBalance += dayStats.net; 
        return {
            date: displayDate,
            amount: runningBalance,
            value: dayStats.net,
            income: dayStats.income,
            expense: dayStats.expense
        };
    });


    const earnedBreakdown = categoryStats
        .filter((s: any) => s.type === "credited" || s.type === "Earned")
        .map((s: any) => ({ name: s.category || "Other", value: s._sum.amount || 0 }));
    
    const spentBreakdown = categoryStats
        .filter((s: any) => s.type === "debited" || s.type === "Spent")
        .map((s: any) => ({ name: s.category || "Other", value: s._sum.amount || 0 }));

    const avgTx = periodTxCount > 0 ? (periodEarned + periodSpent) / periodTxCount : 0;
    
    const roiVal = periodSpent > 0 ? ((periodEarned - periodSpent) / periodSpent) * 100 : 0;

    let grade = "-";
    if (periodTxCount > 0) {
      if (roiVal > 50) grade = "A";
      else if (roiVal > 20) grade = "B";
      else grade = "C";
    }

    const stats = [
        { name: 'Earned', value: periodEarned },
        { name: 'Spent', value: periodSpent },
        { name: 'Avg Tx', value: parseFloat(avgTx.toFixed(2)) },
        { name: 'ROI', value: parseFloat(roiVal.toFixed(2)) },
        { name: 'Grade', value: grade }
    ];

    return {
        trend: trendData,
        breakdown: {
            earned: earnedBreakdown,
            spent: spentBreakdown
        },
        stats
    };
  }
}
