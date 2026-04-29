import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { setAdmin } from "../../../../redux/slices/adminSlice";
import { logout } from "../../../../redux/slices/userSlice";
import { ROUTES } from "../../../../constants/routes";

export const useAdminLoginMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) =>
      apiClient.post("/api/v1/admin/login", credentials),
    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      console.log("Login successful:", response);
      toast.success("Login successful");

      dispatch(setAdmin({ admin: user, accessToken }));

      dispatch(logout());

      navigate(ROUTES.ADMIN_DASHBOARD);
    },
    onError: (error: unknown) => {
      const err = error as { error?: { message?: string }; message?: string; status?: number };
      const errorMessage =
        err.error?.message || err.message || "Login failed";

      console.error("Login failed:", {
        status: err.status,
        message: errorMessage,
        fullError: err,
      });
    },
  });
};
