import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { setUser } from "../../../../redux/slices/userSlice";

export const useGoogleAuthMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string; email: string; name: string }) =>
      apiClient.post("/api/v1/auth/google-auth", credentials),
    onSuccess: (res) => {
      const { user, accessToken, message } = res.data;
      toast.success(message);
      dispatch(setUser({ user, accessToken }));
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });
};
