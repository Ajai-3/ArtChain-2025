import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

export const useUploadArtImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file inside mutation:", file);

      return apiClient.post("/api/v1/upload/art", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Image upload failed!");
    },
  });
};
