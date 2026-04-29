import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from 'react-hot-toast';
import type { CreatePostInput } from "../../../../types/art/CreatePostInput";

export const useCreateArtworkMutation = () => {
  return useMutation({
    mutationFn: (payload: CreatePostInput) =>
      apiClient.post("/api/v1/art", payload),
    onSuccess: (data) => {
      console.log("Artwork created:", data);
      toast.success("Artwork created successfully");
    },
    onError: (error: unknown) => {
      console.error("Artwork creation failed:", error);
    },
  });
};
