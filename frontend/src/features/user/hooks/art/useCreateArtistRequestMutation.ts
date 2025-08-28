import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ArtistRequestPayload } from "../../../../types/art/artistRequestPayload";

export const useCreateArtistRequestMutation = () => {
  return useMutation({
    mutationFn: (data: ArtistRequestPayload) =>
      apiClient.post("/api/v1/user/artist-request", data),
    onSuccess: (res) => {
      console.log("Artist request submitted:", res.data);
      toast.success("Artist request submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};
