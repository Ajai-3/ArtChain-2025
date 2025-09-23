import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export const useCreateRazorpayOrder = () => {
  return useMutation<RazorpayOrderResponse, Error, { amount: number }>({
    mutationFn: async ({ amount }) => {
      const { data } = await apiClient.post<RazorpayOrderResponse>(
        "/api/v1/wallet/razorpay/create-order",
        { amount }
      );
      return data;
    },
  });
};