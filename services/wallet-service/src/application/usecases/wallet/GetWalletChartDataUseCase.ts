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

    // 1. Determine Start Date
    let startDate: Date | undefined;
    const now = new Date();
    // Reset time to end of day to be inclusive? Or just date math.
    // Ideally we want start of the range.
    if (timeRange === "7d") {
       startDate = new Date();
       startDate.setDate(now.getDate() - 7);
       startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "1m") {
       startDate = new Date();
       startDate.setMonth(now.getMonth() - 1);
       startDate.setHours(0, 0, 0, 0);
    }
    // If "all", startDate remains undefined

    // 2. Fetch Aggregated Data
    // dailyStats: [{ date: string, type: string, total_amount: number, count_tx: number }]
    const dailyStats = await this._walletRepo.getDailyStats(wallet.id, startDate);
    const categoryStats = await this._walletRepo.getCategoryStats(wallet.id, startDate);

    // 3. Process Trend
    // Calculate total change in period to find START balance of the period.
    // If we walk forward, we need StartBalance.
    // StartBalance = CurrentBalance - (Sum of ALL changes in the period).
    
    let totalChangeInPeriod = 0;
    
    // Period Aggregates for Stats
    let periodEarned = 0;
    let periodSpent = 0;
    let periodTxCount = 0;

    // Use a map to consolidate by date (since we get rows for each type per date)
    const dailyMap = new Map<string, { net: number; income: number; expense: number }>(); 
    const uniqueDates = new Set<string>();

    dailyStats.forEach((stat: any) => {
        const amount = Number(stat.total_amount); 
        const count = Number(stat.count_tx);
        
        // Fix: Ensure we use a string key for date to avoid object reference issues with Map/Set
        // stat.date comes from the DB driver. If it's a Date object, converting to ISO string substring ensures consistency.
        // If it's already a string, this handles it too.
        let dateKey: string;
        if (stat.date instanceof Date) {
            dateKey = stat.date.toISOString().split('T')[0];
        } else {
            // Fallback if it's a string
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
             totalChangeInPeriod -= amount; // Subtract spent
             periodSpent += amount;
             current.net -= amount;
             current.expense += amount;
        }
        dailyMap.set(dateKey, current);

        periodTxCount += count;
        uniqueDates.add(dateKey); 
    });

    let runningBalance = wallet.balance - totalChangeInPeriod; 
    
    // Convert Set to Array and Sort by string comparison (YYYY-MM-DD works alphabetically)
    const sortedDates = Array.from(uniqueDates).sort();
    
    const trendData = sortedDates.map(dateStr => {
        const dateObj = new Date(dateStr);
        const displayDate = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        
        const dayStats = dailyMap.get(dateStr) || { net: 0, income: 0, expense: 0 };
        runningBalance += dayStats.net; // Add change to get END of day balance
        
        return {
            date: displayDate,
            amount: runningBalance,
            value: dayStats.net,
            income: dayStats.income,
            expense: dayStats.expense
        };
    });

    // 4. Process Breakdown
    // Using simple defaults for category names if null
    const earnedBreakdown = categoryStats
        .filter((s: any) => s.type === "credited" || s.type === "Earned")
        .map((s: any) => ({ name: s.category || "Other", value: s._sum.amount || 0 }));
    
    const spentBreakdown = categoryStats
        .filter((s: any) => s.type === "debited" || s.type === "Spent")
        .map((s: any) => ({ name: s.category || "Other", value: s._sum.amount || 0 }));

    // 5. Process Stats (Radar)
    const avgTx = periodTxCount > 0 ? (periodEarned + periodSpent) / periodTxCount : 0;
    
    const roiVal = periodSpent > 0 ? ((periodEarned - periodSpent) / periodSpent) * 100 : 0;

    let grade = "-";
    // Check if there is significant activity to grade
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
