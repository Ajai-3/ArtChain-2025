import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

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
      return apiClient.post("/api/v1/art/commission/request", data);
    },
    onSuccess: () => {
      toast.success("Commission requested successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to request commission"
      );
    },
  });
};
