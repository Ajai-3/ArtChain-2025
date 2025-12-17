export interface UpdateWithdrawalStatusDTO {
  withdrawalId: string;
  status: string;
  rejectionReason?: string;
}
