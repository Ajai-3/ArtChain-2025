import { useMemo } from "react";

interface Transaction {
  id: string | number;
  date: string;
  type: string;
  amount: number;
  category?: string;
}

export const useChartData = (
  transactions: Transaction[],
  timeRange: "7d" | "1m" | "all"
) => {
  // 1. Filter Transactions based on Time Range
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    const now = new Date();
    const rangeDate = new Date();

    if (timeRange === "7d") {
      rangeDate.setDate(now.getDate() - 7);
    } else if (timeRange === "1m") {
      rangeDate.setMonth(now.getMonth() - 1);
    } else {
      return transactions; // All time
    }

    return transactions.filter((tx) => new Date(tx.date) >= rangeDate);
  }, [transactions, timeRange]);

  // 2. Recalculate Summary based on Filtered Data
  const summary = useMemo(() => {
    // A. ALL Credited/Debited (For Dashboard Analysis)
    const totalCredited = filteredTransactions
      .filter((tx) => tx.type === "Earned" || tx.type === "credited")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalDebited = filteredTransactions
      .filter((tx) => tx.type === "Spent" || tx.type === "debited")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // B. Business Only (For Transactions Tab Logic)
    const businessEarned = filteredTransactions
      .filter((tx) => 
        (tx.type === "Earned" || tx.type === "credited") && 
        (tx.category === "SALE" || tx.category === "COMMISSION")
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const businessSpent = filteredTransactions
      .filter((tx) => 
        (tx.type === "Spent" || tx.type === "debited") &&
        (tx.category === "PURCHASE")
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalCredited,
      totalDebited,
      businessEarned,
      businessSpent,
      netGain: businessEarned - businessSpent, // Usually P&L implies business
      netFlow: totalCredited - totalDebited, // Cash flow
    };
  }, [filteredTransactions]);

  // 3. Prepare Chart Data
  const chartData = useMemo(() => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      return { trend: [], overview: [], allCredited: [], allDebited: [], businessEarned: [], businessSpent: [] };
    }

    // A. Trend Data (All transactions, Balance History)
    let runningBalance = 0; 
    const sortedForTrend = [...filteredTransactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const trendData = sortedForTrend.map(tx => {
       const change = (tx.type === "Earned" || tx.type === "credited") ? tx.amount : -tx.amount;
       runningBalance += change;
       return {
         date: new Date(tx.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
         amount: runningBalance, 
         value: change 
       };
    });

    // B. Business Overview Data (Income vs Expense - Business Only) - For Line Charts in Transaction Tab
    const groups: Record<
      string,
      { date: string; income: number; expense: number }
    > = {};

    filteredTransactions.forEach((tx) => {
      const date = new Date(tx.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short"});
      if (!groups[date]) groups[date] = { date, income: 0, expense: 0 };
      
      if ((tx.type === "Earned" || tx.type === "credited") && (tx.category === "SALE" || tx.category === "COMMISSION")) {
        groups[date].income += tx.amount;
      } else if ((tx.type === "Spent" || tx.type === "debited") && (tx.category === "PURCHASE")) {
        groups[date].expense += tx.amount;
      }
    });
    const overviewData = Object.values(groups).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // For Line/Area chart, chronological is better? 
    // Wait, previous code reversed it because API was desc? Here we built it. Let's keep chronological for charts.

    // C. Breakdown Helper
    const getBreakdown = (types: string[], categories?: string[]) => {
      const categoryMap: Record<string, number> = {};
      
      filteredTransactions
        .filter((tx) => {
            if (!types.includes(tx.type)) return false;
            if (categories && categories.length > 0) {
                return tx.category && categories.includes(tx.category);
            }
            return true;
        })
        .forEach((tx) => {
          const cat = tx.category || "Other";
          categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
        });

      return Object.entries(categoryMap).map(([name, value]) => ({
        name: name.replace("_", " "),
        value,
      }));
    };

    return {
      trend: trendData,
      overview: overviewData,
      allCredited: getBreakdown(["Earned", "credited"]),
      allDebited: getBreakdown(["Spent", "debited"]),
      businessEarned: getBreakdown(["Earned", "credited"], ["SALE", "COMMISSION"]),
      businessSpent: getBreakdown(["Spent", "debited"], ["PURCHASE"]),
    };
  }, [filteredTransactions]);

  return { filteredTransactions, summary, chartData };
};
