import { useEffect } from "react";
import { getChatSocket } from "../../../../../socket/socketManager";

export const useConvoOpen = (conversationId?: string) => {
  useEffect(() => {
    if (!conversationId) return;

    let intervalId: NodeJS.Timeout;

    const joinConversation = () => {
      const socket = getChatSocket();
      if (socket && socket.connected) {
        socket.emit("convoOpened", {
          conversationId,
          time: new Date(),
        });
        return true;
      }
      return false;
    };

    // Try immediately
    if (!joinConversation()) {
      // If not ready, poll until it is
      intervalId = setInterval(() => {
        if (joinConversation()) {
          clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [conversationId]);
};
