import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface StripeSessionResponse {
  sessionId: string;
}

export const useCreateStripeSession = () => {
  return useMutation<StripeSessionResponse, Error, { amount: number }>({
    mutationFn: async ({ amount }) => {
      const { data } = await apiClient.post<StripeSessionResponse>(
        API_ENDPOINTS.WALLET_STRIPE_CREATECHECKOUTSESSION,
        { amount }
      );
      return data;
    },
  });
};
