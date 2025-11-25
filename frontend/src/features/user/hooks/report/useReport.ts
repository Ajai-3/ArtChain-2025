import { useMutation } from "@tanstack/react-query";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  });
};
