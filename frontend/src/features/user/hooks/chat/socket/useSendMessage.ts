import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { DeleteMode, type Message } from "../../../../../types/chat/chat";
import { addMessage, updateConversation } from "../../../../../redux/slices/chatSlice";
import { getChatSocket } from "../../../../../socket/socketManager";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";

interface SendMessageParams {
  conversationId: string;
  content: string;
}

export const useSendMessage = () => {
  const dispatch = useDispatch();
  const message = useSelector((s: RootState) => s.chat.messages)
  const currentUserId = useSelector((s: RootState) => s.user.user?.id);
  const conversations = useSelector((s: RootState) => s.chat.conversations)
  
  const sendMessage = useCallback(
    async ({ conversationId, content }: SendMessageParams) => {
      if (!currentUserId) return;
      const socket = getChatSocket();

      if (!conversationId || !content.trim() || !socket) {
        console.error(
          "Cannot send message: missing required parameters or socket"
        );
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        conversationId,
        senderId: currentUserId,
        deleteMode: DeleteMode.NONE,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
      };

      console.log("📤 Sending message via socket:", {
        conversationId,
        content: content.trim(),
      });

      dispatch(addMessage(tempMessage));
       const currentConversation = conversations.find(
         (c) => c.id === conversationId
       );
       if (currentConversation) {
         const updatedConversation = {
           ...currentConversation,
           lastMessage: tempMessage,
           updatedAt: new Date().toISOString(),
         };

         dispatch(updateConversation(updatedConversation));
       }

      console.log(message)

      try {
        socket.emit("sendMessage", {
          conversationId,
          content: content.trim(),
          tempId,
        });
      } catch (error) {
        console.error("❌ Failed to send message via socket:", error);
      }
    },
    [dispatch]
  );

  return { sendMessage };
};

