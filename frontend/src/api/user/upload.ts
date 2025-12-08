import apiClient from "../axios";

export const uploadImage = async (file: File): Promise<{ key: string; publicUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "chatImage");

  const response = await apiClient.post("/api/v1/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
