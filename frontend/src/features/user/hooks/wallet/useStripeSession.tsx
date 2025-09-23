import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";


export interface StripeSessionResponse {
  sessionId: string;
  amountPaid: number;
  currency: string;
  userId: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string;
  created?: number;
  receiptUrl?: string;
  customerEmail?: string;
}

export const useStripeSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["stripe-session", sessionId],
    queryFn: async (): Promise<StripeSessionResponse> => {
      if (!sessionId) throw new Error("No session ID provided");
      const { data } = await apiClient.get<StripeSessionResponse>(
        `/api/v1/wallet/stripe/session/${sessionId}`
      );
      return data;
    },
    enabled: !!sessionId, // Only fetch if sessionId exists
  });
};
