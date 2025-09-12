import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../../../api/axios";
import { updateProfile } from "../../../../redux/slices/userSlice";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/users/user/user";

interface DeleteResponse {
  message: string;
}

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const currentProfileUrl = user?.profileImage;

  return useMutation<User, Error, void>({
    mutationFn: async () => {
      if (!currentProfileUrl) throw new Error("No profile image to delete");

      // 1. Delete from uploader service
      await apiClient.post<DeleteResponse>("/api/v1/upload/delete", {
        fileUrl: currentProfileUrl,
      });

      // 2. Update user profile (remove image)
      const patchRes = await apiClient.patch<{ message: string; user: User }>(
        "/api/v1/user/profile",
        { profileImage: "" }
      );

      return patchRes.data.user;
    },
    onSuccess: (updatedUser: User) => {
      dispatch(updateProfile({ user: updatedUser }));
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.username] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete profile image:", error);
    },
  });
};
