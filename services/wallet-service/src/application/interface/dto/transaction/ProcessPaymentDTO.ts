export interface ProcessPaymentDTO {
  payerId: string;
  payeeId: string;
  amount: number;
  description: string;
  referenceId: string;
  category?: string;
}
