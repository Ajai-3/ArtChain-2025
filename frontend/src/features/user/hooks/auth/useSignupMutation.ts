import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useMutation } from "@tanstack/react-query";

export const useSignupMutation = (
  setFormError: (msg: string | null) => void
) => {
  return useMutation({
    mutationFn: (credentials: {
      name: string;
      username: string;
      email: string;
    }) => apiClient.post("/api/v1/auth/start-register", credentials),
    onSuccess: (res) => {
      console.log("Verification email sended:", res.data);
      toast.success("Verification email sended");
    },
    onError: (error: any) => {
      const msg = error?.message || "Signup failed";
      setFormError(msg);
    },
  });
};