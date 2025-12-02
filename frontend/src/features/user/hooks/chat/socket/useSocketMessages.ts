import { useEffect } from "react";
import { getChatSocket } from '../../../../../socket/socketManager';
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { removeMessage, updateMessage } from "../../../../../redux/slices/chatSlice";

export const useSocketMessages = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    const chatSocket = getChatSocket();
    if (!chatSocket) {
      console.log("Chat socket not available");
      return;
    }

    chatSocket.on("group_update", ({ conversationId }) => {
       console.log("👥 Group update received:", conversationId);
       queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    });

    chatSocket.on("messageDeleted", ({ conversationId, messageId, deleteMode }) => {
        console.log("🗑️ Message deleted:", messageId, deleteMode);
        if (deleteMode === "ALL") {
            dispatch(updateMessage({ 
                id: messageId, 
                conversationId, 
                deleteMode: "ALL",
                isDeleted: true,
                content: "", 
            }));
        } else {
            dispatch(removeMessage({ conversationId, messageId }));
        }
    });

    return () => {
       chatSocket.off("group_update");
       chatSocket.off("messageDeleted");
    };
  }, [queryClient, dispatch]);
};