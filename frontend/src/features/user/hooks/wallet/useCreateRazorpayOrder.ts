import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export const useCreateRazorpayOrder = () => {
  return useMutation<RazorpayOrderResponse, Error, { amount: number }>({
    mutationFn: async ({ amount }) => {
      const { data } = await apiClient.post<RazorpayOrderResponse>(
        API_ENDPOINTS.WALLET_RAZORPAY_CREATEORDER,
        { amount }
      );
      return data;
    },
  });
};