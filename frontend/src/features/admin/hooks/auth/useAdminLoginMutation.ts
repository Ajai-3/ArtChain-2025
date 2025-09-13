import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { setAdmin } from "../../../../redux/slices/adminSlice";


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

      navigate('/admin/dashboard');

    },
    onError: (error: any) => {
      const errorMessage =
        error.error?.message || error.message || "Login failed";

      console.error("Login failed:", {
        status: error.status,
        message: errorMessage,
        fullError: error,
      });
    },
  });
};