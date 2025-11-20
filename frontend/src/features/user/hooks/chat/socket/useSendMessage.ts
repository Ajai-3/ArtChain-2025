import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteMode, type Message } from "../../../../../types/chat/chat";
import {
  addMessage,
  updateConversation,
} from "../../../../../redux/slices/chatSlice";
import { getChatSocket } from "../../../../../socket/socketManager";
import {
  selectCurrentUserId,
  selectConversations,
} from "../../../../../redux/selectors/chatSelectors";

interface SendMessageParams {
  conversationId: string;
  content: string;
}

export const useSendMessage = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const conversations = useSelector(selectConversations);

  const sendMessage = useCallback(
    async ({ conversationId, content }: SendMessageParams) => {
      if (!currentUserId) {
        console.error("No current user ID");
        return;
      }

      const socket = getChatSocket();
      if (!conversationId || !content.trim() || !socket) {
        console.error(
          "Cannot send message: missing required parameters or socket"
        );
        return;
      }

      const id = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id,
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
        id
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

      try {
        socket.emit("sendMessage", {
          conversationId,
          content: content.trim(),
          id,
        });
      } catch (error) {
        console.error("❌ Failed to send message via socket:", error);
      }
    },
    [dispatch, currentUserId, conversations]
  );

  return { sendMessage };
};
