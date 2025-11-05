import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../../../api/axios";
import { updateProfile } from "../../../../redux/slices/userSlice";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/users/user/user";
import toast from "react-hot-toast";

type ImageType = "profileImage" | "bannerImage" | "backgroundImage";

interface DeleteImageInput {
  type: ImageType;
}

export const useDeleteUserImage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<void, Error, DeleteImageInput>({
    mutationFn: async ({ type }) => {
      const currentImageUrl = user?.[type];
      if (!currentImageUrl) throw new Error(`No ${type} to delete`);
      await apiClient.post("/api/v1/upload/delete", { fileUrl: currentImageUrl, type });
    },

    onSuccess: (_, variables) => {
      dispatch(
        updateProfile({
          user: {
            ...user!,
            [variables.type]: "",
          } as User,
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["userProfile", user?.username],
      });

      toast.success("Image deleted successfully!");
    },

    onError: (error: Error) => {
      console.error("Failed to delete user image:", error);
      toast.error("Failed to delete image. Try again.");
    },
  });
};
