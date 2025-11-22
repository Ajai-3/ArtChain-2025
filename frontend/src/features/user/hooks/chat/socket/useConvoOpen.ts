import { useEffect } from "react";
import { getChatSocket } from "../../../../../socket/socketManager";

export const useConvoOpen = (conversationId?: string) => {
  const socket = getChatSocket();

  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("convoOpened", {
      conversationId,
      time: new Date(),
    });

    socket.emit("joinRoom", conversationId);
  }, [conversationId, socket]);
};
