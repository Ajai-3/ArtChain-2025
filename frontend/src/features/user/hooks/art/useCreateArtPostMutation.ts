import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { CreatePostInput } from "../../../../types/art/CreatePostInput";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";

export const useCreatePostMutation = (onClose: ()=> void) => {
  const navigate= useNavigate()
  return useMutation({
    mutationFn: (data: CreatePostInput) => apiClient.post("/api/v1/art", data),
    onSuccess: (res: any) => {
      console.log(res.data);
      toast.success("Post created successfully!");
      onClose()
      navigate(ROUTES.HOME)
    },
    onError: (err: any) => {
      console.log(err)
      toast.error(err?.message || "Failed to create post!");
    },
  });
};
