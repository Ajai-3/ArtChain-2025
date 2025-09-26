import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface StripeSessionResponse {
  sessionId: string;
}

export const useCreateStripeSession = () => {
  return useMutation<StripeSessionResponse, Error, { amount: number }>({
    mutationFn: async ({ amount }) => {
      const { data } = await apiClient.post<StripeSessionResponse>(
        "/api/v1/wallet/stripe/create-checkout-session",
        { amount }
      );
      return data;
    },
  });
};
