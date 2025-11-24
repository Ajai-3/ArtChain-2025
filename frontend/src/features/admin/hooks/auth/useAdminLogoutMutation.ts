import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { adminLogout } from "../../../../redux/slices/adminSlice";
import { ROUTES } from "../../../../constants/routes";

export const useAdminLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => apiClient.post("/api/v1/admin/logout"),
    onSuccess: () => {
      toast.success("Logout successful");
      dispatch(adminLogout());
      navigate(ROUTES.ADMIN_LOGIN);
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      dispatch(adminLogout());
      navigate(ROUTES.ADMIN_LOGIN);
    },
  });
};
