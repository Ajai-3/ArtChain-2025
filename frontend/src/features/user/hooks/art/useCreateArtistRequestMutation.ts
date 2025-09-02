import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ArtistRequestPayload } from "../../../../types/art/artistRequestPayload";

export const useCreateArtistRequestMutation = () => {
  return useMutation({
    mutationFn: (data: ArtistRequestPayload) =>
      apiClient.post("/api/v1/user/artist-request", data),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};
