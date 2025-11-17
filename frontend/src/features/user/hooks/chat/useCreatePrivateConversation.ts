import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../types/apiError";

export const useCreatePrivateConversation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (credentials: {
      userId: string;
      otherUserId: string;
    }) => {
      const res = await apiClient.post(
        "/api/v1/chat/conversation/private",
        credentials
      );

      console.log("Private conversation created data f  :", res.data);

      return res.data;
    },
    onSuccess: (res) => {
      console.log("Private conversation created:", res.data.conversationId);
      navigate(`/chat/${res.data.conversationId}`);
      toast.success("Private conversation created");
    },
    onError: (error: ApiError) => {
      console.log("Error creating private conversation:", error);
      toast.error(error.message);
    },
  });
};
