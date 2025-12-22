export const WithdrawalMethod = {
  BANK_TRANSFER: "BANK_TRANSFER",
  UPI: "UPI",
} as const;
export type WithdrawalMethod = typeof WithdrawalMethod[keyof typeof WithdrawalMethod];

export const WithdrawalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
  FAILED: "FAILED",
} as const;
export type WithdrawalStatus = typeof WithdrawalStatus[keyof typeof WithdrawalStatus];

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface UpiDetails {
  upiId: string;
}

export class WithdrawalRequest {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly walletId: string,
    public readonly amount: number,
    public readonly method: WithdrawalMethod,
    public readonly status: WithdrawalStatus = WithdrawalStatus.PENDING,
    public readonly accountHolderName?: string | null,
    public readonly accountNumber?: string | null,
    public readonly ifscCode?: string | null,
    public readonly upiId?: string | null,
    public readonly transactionId?: string | null,
    public readonly rejectionReason?: string | null,
    public readonly processedAt?: Date | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
