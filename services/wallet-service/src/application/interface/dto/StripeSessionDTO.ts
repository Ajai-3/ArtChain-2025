export interface StripeSessionDTO {
  sessionId: string;
  currency: string;
  userId: string | null;
  paymentMethod?: string;
  paymentStatus?: string;
  amountPaid: number;
  paymentId?: string;
  created?: number;
  customerEmail?: string;
}