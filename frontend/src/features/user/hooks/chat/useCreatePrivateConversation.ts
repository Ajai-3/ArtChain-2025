import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiClient from "../../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../types/apiError";
import type { Conversation } from "../../../../types/chat/chat";
import {
  addConversation,
  updateConversation,
} from "../../../../redux/slices/chatSlice";
import type { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

interface CreateConversationResponse {
  isNewConvo: boolean;
  conversation: Conversation;
}

export const useCreatePrivateConversation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const conversations = useSelector((state: RootState) => state.chat.conversations);

  return useMutation({
    mutationFn: async (credentials: {
      userId: string;
      otherUserId: string;
    }) => {
      const res = await apiClient.post(
        "/api/v1/chat/conversation/private",
        credentials
      );
      return res.data.data;
    },
    onSuccess: (data: CreateConversationResponse) => {
      if (data.isNewConvo) {
        dispatch(addConversation(data.conversation));
        toast.success("Conversation started");

      } else {
        dispatch(updateConversation(data.conversation));
        toast.success("Conversation opened");
      }

      setTimeout(() => {
        navigate(`/chat/${data.conversation.id}`);
      }, 500);
    },
    onError: (error: ApiError) => {
      console.log("Error creating private conversation:", error);
      toast.error(error.message);
    },
  });
};
