export interface CreateWithdrawalRequestDTO {
  userId: string;
  amount: number;
  method: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}
