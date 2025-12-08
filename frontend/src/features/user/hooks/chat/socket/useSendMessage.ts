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
  mediaType?: "TEXT" | "IMAGE";
  tempId?: string;
  mediaUrl?: string;
}

export const useSendMessage = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const conversations = useSelector(selectConversations);

  const sendMessage = useCallback(
    async ({ conversationId, content, mediaType = "TEXT", tempId, mediaUrl }: SendMessageParams) => {
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

      const id = tempId || `temp-${Date.now()}`;
      const tempMessage: Message = {
        id,
        conversationId,
        senderId: currentUserId,
        deleteMode: DeleteMode.NONE,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readBy: [],
        tempId: id,
        mediaType,
        mediaUrl: mediaUrl,
      };

      console.log("📤 Sending message via socket:", {
        conversationId,
        content: content.trim(),
        id,
        mediaType
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
          tempId: id,
          mediaType,
        });
      } catch (error) {
        console.error("❌ Failed to send message via socket:", error);
      }
    },
    [dispatch, currentUserId, conversations]
  );

  return { sendMessage };
};
