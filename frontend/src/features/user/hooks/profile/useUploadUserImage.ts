import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/users/user/user";
import { updateProfile } from "../../../../redux/slices/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  return useMutation<UploadResponse, Error, UploadImageInput>({
    mutationFn: async ({ file, type }) => {
      const formData = new FormData();
      formData.append("file", file);
      if (user?.[type])
        formData.append("previousFileUrl", user[type] as string);
      formData.append("type", type);

      const { data } = await apiClient.post<UploadResponse>(
        "/api/v1/upload/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },

    onSuccess: (data, variables) => {
      const newUrl = data.data.url;
      const field = variables.type;

      if (user) {
        const updatedUser = { ...user, [field]: newUrl } as User;
        dispatch(updateProfile({ user: updatedUser }));
      }

      queryClient.setQueryData(
        ["userProfile", user?.username],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              user: {
                ...oldData.data.user,
                [field]: newUrl,
              },
            },
          };
        }
      );

      const labelMap: Record<ImageType, string> = {
        profileImage: "Profile picture",
        bannerImage: "Banner image",
        backgroundImage: "Background image",
      };

      toast.success(`${labelMap[field]} updated successfully`);
    },

    onError: (error) => {
      console.error("UPLOAD FAILED:", error);
      toast.error("Image upload failed");
    },
  });
};
