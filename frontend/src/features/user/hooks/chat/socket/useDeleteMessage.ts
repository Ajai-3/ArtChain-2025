import { useCallback } from "react";
import apiClient from "../../../../../api/axios";
import { useDispatch } from "react-redux";
import { removeMessage, updateMessage } from "../../../../../redux/slices/chatSlice";

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

        await apiClient.delete(`/api/v1/chat/message/${messageId}`, {
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
