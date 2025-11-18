import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../types/apiError";
import type { Conversation } from "../../../../types/chat/chat";
import { addConversation } from "../../../../redux/slices/chatSlice";


interface CreateConversationResponse {
  isNewConvo: boolean;
  conversation: Conversation;
}


export const useCreatePrivateConversation = () => {
  const dispatch = useDispatch();

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

      return res.data.data;
    },
    onSuccess: (data: CreateConversationResponse) => {

      console.log("✅ Conversation created:", data.conversation);

      dispatch(addConversation(data.conversation));

      navigate(`/chat/${data.conversation.id}`, {});

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
