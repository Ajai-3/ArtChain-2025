import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../../../api/axios";
import { updateProfile } from "../../../../redux/slices/userSlice";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/users/user/user";

type ImageType = "profileImage" | "bannerImage";

interface DeleteImageInput {
  type: ImageType;
}

export const useDeleteUserImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<User, Error, DeleteImageInput>({
    mutationFn: async ({ type }) => {
      const currentImageUrl = `${user?.[type]}`;
      console.log(currentImageUrl)
      if (!currentImageUrl) throw new Error(`No ${type} to delete`);

      await apiClient.post("/api/v1/upload/delete", { fileUrl: currentImageUrl });


      const patchRes = await apiClient.patch<{ message: string; user: User }>(
        "/api/v1/user/profile",
        { [type]: "" }
      );

      console.log(patchRes.data)

      return patchRes.data.user;
    },
    onSuccess: (updatedUser: User) => {
      dispatch(updateProfile({ user: updatedUser }));
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.username] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete user image:", error);
    },
  });
};
