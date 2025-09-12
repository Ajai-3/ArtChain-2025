import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { updateProfile } from "../../../../redux/slices/userSlice";
import type { User } from "../../../../types/users/user/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface UpdateProfileImageInput {
  file: File;
}

interface UploadResponse {
  message: string;
  result: {
    url: string;
    userId: string;
    type: string;
  };
}
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const previousFileUrl = user?.profileImage;

  return useMutation<User, Error, UpdateProfileImageInput>({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      if (previousFileUrl) {
        formData.append("previousFileUrl", previousFileUrl);
      }

      const uploadRes = await apiClient.post<UploadResponse>(
        "/api/v1/upload/profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const profileImageUrl = uploadRes.data?.result.url;

      const patchRes = await apiClient.patch<{ message: string; user: User }>(
        "/api/v1/user/profile",
        {
          profileImage: profileImageUrl,
        }
      );

      return patchRes.data.user;
    },
    onSuccess: (updatedUser: User) => {
      dispatch(updateProfile({ user: updatedUser }));
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.username] });
    },
    onError: (error: Error) => {
      console.error("Profile update failed:", error);
    },
  });
};
