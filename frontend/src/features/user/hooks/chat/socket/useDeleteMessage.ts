import { useCallback } from "react";
import apiClient from "../../../../../api/axios";
import { useDispatch } from "react-redux";
import { removeMessage, updateMessage } from "../../../../../redux/slices/chatSlice";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

export const useDeleteMessage = (currentUserId: string) => {
  const dispatch = useDispatch();

  const deleteMessage = useCallback(
    async (messageId: string, conversationId: string, deleteForAll: boolean) => {
      try {
        const mode = deleteForAll ? "EVERYONE" : "ME";
        
        // Optimistic update
        if (!deleteForAll) {
             dispatch(removeMessage({ conversationId, messageId }));
        } else {
             dispatch(updateMessage({ 
               id: messageId, 
               conversationId, 
               deleteMode: "ALL",
               isDeleted: true,
               content: "",
             }));
        }

        await apiClient.delete(API_ENDPOINTS.CHAT_MESSAGE_2(messageId), {
          data: { userId: currentUserId, mode },
        });

      } catch (error) {
        console.error("Failed to delete message", error);
      }
    },
    [currentUserId, dispatch]
  );

  return { deleteMessage };
};
