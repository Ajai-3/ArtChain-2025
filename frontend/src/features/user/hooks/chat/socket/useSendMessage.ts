import { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { Message } from "../../../../../types/chat/chat";
import { addMessage } from "../../../../../redux/slices/chatSlice";
import { getChatSocket } from "../../../../../socket/socketManager";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../redux/store";

interface SendMessageParams {
  conversationId: string;
  content: string;
}

export const useSendMessage = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((s: RootState) => s.user.user?.id);
  const message = useSelector((s: RootState) => s.chat.messages)
  
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
      const tempMessage: any = {
        tempId: tempId,
        conversationId,
        senderId: currentUserId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        readBy: [],
      };

      console.log("📤 Sending message via socket:", {
        conversationId,
        content: content.trim(),
      });

      dispatch(addMessage(tempMessage));

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

