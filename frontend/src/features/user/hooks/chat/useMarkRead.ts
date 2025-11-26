import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { getChatSocket } from "../../../../socket/socketManager";
import { markMessagesAsRead, setConversationUnreadCount } from "../../../../redux/slices/chatSlice";

export const useMarkRead = (conversationId: string | undefined, currentUserId: string) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => 
    conversationId ? state.chat.messages[conversationId] : []
  );

  useEffect(() => {
    if (!conversationId || !messages || messages.length === 0) return;

    const unreadMessages = messages.filter(
      (m) => m.senderId !== currentUserId && (!m.readBy || !m.readBy.includes(currentUserId))
    );

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((m) => m.id);
      
      // Emit socket event
      const socket = getChatSocket();
      if (socket && socket.connected) {
        socket.emit("markMessagesRead", {
          conversationId,
          messageIds,
        });
      }

      // Optimistic update
      dispatch(
        markMessagesAsRead({
          conversationId,
          messageIds,
          readBy: currentUserId,
        })
      );
      
      dispatch(
        setConversationUnreadCount({
          conversationId,
          count: 0,
        })
      );
    }
  }, [conversationId, messages, currentUserId, dispatch]);
};
