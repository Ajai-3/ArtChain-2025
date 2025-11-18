import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../types/apiError";
import type { User } from "../../../../types/users/user/user";

interface CreateConversationResponse {
  conversationId: string;
  isNewConvo: boolean;
}


export const useCreatePrivateConversation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (credentials: {
      userId: string;
      otherUserId: string;
      profileUser: User;
    }) => {
      const res = await apiClient.post(
        "/api/v1/chat/conversation/private",
        credentials
      );

      console.log("Private conversation created data f  :", res.data);

      return res.data.data;
    },
    onSuccess: (data: CreateConversationResponse, variables) => {
      console.log("✅ Conversation created:", data.conversationId);
      
      navigate(`/chat/${data.conversationId}`, { 
        state: { 
          profileUser: variables.profileUser 
        } 
      });
      
      if (data.isNewConvo) {
        toast.success("Conversation started");
      } else {
        toast.success("Conversation opened");
      }
    },
    onError: (error: ApiError) => {
      console.log("Error creating private conversation:", error);
      toast.error(error.message);
    },
  });
};
