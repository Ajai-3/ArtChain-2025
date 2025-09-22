import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../../../api/axios";
import { updateProfile } from "../../../../redux/slices/userSlice";
import type { User } from "../../../../types/users/user/user";
import type { RootState } from "../../../../redux/store";
import toast from "react-hot-toast";

type ImageType = "profileImage" | "bannerImage" | "backgroundImage";

interface UploadImageInput {
  file: File;
  type: ImageType;
}

interface UploadResponse {
  message: string;
  data: {
    url: string;
    userId: string;
    type: string;
  };
}

export const useUploadUserImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<User, Error, UploadImageInput>({
    mutationFn: async ({ file, type }) => {
      const previousFileUrl = user?.[type];

      const formData = new FormData();
      formData.append("file", file);
      if (previousFileUrl) {
        formData.append("previousFileUrl", previousFileUrl);
      }
      formData.append("type", type);

      const uploadRes = await apiClient.post<UploadResponse>(
        "/api/v1/upload/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrl = uploadRes.data.data.url;

      const patchRes = await apiClient.patch<{ message: string; user: User }>(
        "/api/v1/user/profile",
        { [type]: uploadedUrl }
      );

      return patchRes.data.user;
    },
    onSuccess: (updatedUser: User, variables) => {
      dispatch(updateProfile({ user: updatedUser }));
      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.username],
      });
      const typeLabel =
        variables.type === "profileImage"
          ? "Profile picture"
          : variables.type === "bannerImage"
          ? "Banner"
          : "Background";

      toast.success(`${typeLabel} updated successfully!`);
    },
    onError: (error: Error) => {
      console.error("Image upload failed:", error);
    },
  });
};
