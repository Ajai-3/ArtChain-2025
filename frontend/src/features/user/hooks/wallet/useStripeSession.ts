import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

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
      const { data } = await apiClient.get<{ message: string; sessionData: StripeSessionResponse }>(
        API_ENDPOINTS.WALLET_STRIPE_SESSION(sessionId)
      );
      return data.sessionData;
    },
    enabled: !!sessionId, // Only fetch if sessionId exists
  });
};
