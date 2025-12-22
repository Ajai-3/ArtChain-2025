export interface GetWithdrawalRequestsDTO {
  userId: string;
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
}
