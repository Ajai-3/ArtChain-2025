import {
  TransactionCategory,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from "../../entities/Transaction";

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
