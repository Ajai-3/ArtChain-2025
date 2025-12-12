import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setUser } from "../../../../redux/slices/userSlice";
import apiClient from "../../../../api/axios";
import type { ApiError } from "../../../../types/apiError";
import { ROUTES } from "../../../../constants/routes";

export const useLoginMutation = (
  setFormError: (msg: string | null) => void
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) =>
      apiClient.post("/api/v1/auth/login", credentials),
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      toast.success("Login successful");
      dispatch(setUser({ user, accessToken }));
      navigate(ROUTES.HOME);
    },
    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
