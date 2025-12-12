import {
  TransactionCategory,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from "../../../../domain/entities/Transaction";

export interface GetTransactionsDto {
  userId?: string;
  walletId?: string;
  page: number;
  limit: number;
  method?: TransactionMethod;
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
}
