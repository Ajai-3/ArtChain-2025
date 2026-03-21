export interface PurchaseAnalyticsRaw {
  timeline: { 
    _id: string; 
    totalSpent: number; 
    count: number; 
  }[];
  stats: { 
    totalSpent: number; 
    totalItems: number; 
  }[];
}

export interface IGetPurchaseAnalyticsUseCase {
  execute(userId: string, range: string): Promise<{
    totalPurchases: number;
    totalAmount: number;
    purchaseTrend: {
      date: string;
      count: number;
      amount: number;
    }[];
  }>;
}