import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { setUser } from "../../../../redux/slices/userSlice";

export const useSignupverificationMutation = (
  setFormError: (msg: string | null) => void
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string; password: string }) =>
      apiClient.post("/api/v1/auth/register", credentials),
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      toast.success("Verification successful");
      dispatch(setUser({ user, accessToken }));
      navigate("/");
    },
    onError: (error) => {
      const msg = error?.message || "Verification failed:";
      setFormError(msg);
    },
  });
};