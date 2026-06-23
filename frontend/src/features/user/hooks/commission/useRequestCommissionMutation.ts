import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface RequestCommissionVariables {
  artistId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  referenceImages?: string[];
}

export const useRequestCommissionMutation = () => {
  return useMutation({
    mutationFn: (data: RequestCommissionVariables) => {
      return apiClient.post(API_ENDPOINTS.ART_COMMISSION_REQUEST, data);
    },
    onSuccess: () => {
      toast.success("Commission requested successfully!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Failed to request commission"
      );
    },
  });
};
