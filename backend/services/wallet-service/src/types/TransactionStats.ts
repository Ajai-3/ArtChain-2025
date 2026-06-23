export interface DailyTransactionStat {
  date: string | Date;
  earned?: number;
  spent?: number;
  type?: string;
  category?: string;
  total_amount?: number;
  count_tx?: number;
}

export interface TransactionStatsResponse {
  stats: DailyTransactionStat[];
  totalCredited: number;
  totalDebited: number;
  transactionCount: number;
}

export type AdminTransactionStatsResponse = DailyTransactionStat[];