import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../../../redux/slices/userSlice";
import type { ApiError } from "../../../../types/apiError";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => apiClient.post("/api/v1/auth/logout"),
    onSuccess: (res) => {
      console.log("Logout successful:", res.data);
      dispatch(logout());
      queryClient.clear();
      navigate("/login");
      toast.success("Logout successful");
    },
    onError: (error: ApiError) => {
      toast.error("Logout failed");
    },
  });
};
