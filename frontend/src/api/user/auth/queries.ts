import apiClient from "../../axios";
import { useQuery } from "@tanstack/react-query";

// User Profile
export const useUserProfile = () => {
  useQuery({
    queryKey: ["userProfile"],
    queryFn: () => apiClient.get("api/v1/users/profile"),
    retry: 2,
    refetchInterval: false,
  });
};
