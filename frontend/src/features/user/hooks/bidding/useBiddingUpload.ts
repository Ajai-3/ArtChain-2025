import { useState } from "react";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useBiddingUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadBiddingImage = async (file: File): Promise<{ key: string; publicUrl: string } | null> => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "biddingImage");

    try {
      const response = await apiClient.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response.data);
      // The backend returns { data: { ... }, message: ... }
      // We want the inner data object
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error("Upload failed", error);
      toast.error("Failed to upload bidding image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadBiddingImage, uploading };
};
