import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface ReportData {
  targetId: string;
  targetType: "art" | "comment" | "user";
  reason: string;
  description?: string;
}

export const useReport = () => {
  return useMutation({
    mutationFn: async (data: ReportData) => {
      console.log("Reporting...", data);
      await apiClient.post("/api/v1/user/report", data);
      return { success: true };
    },
  });
};
