import { useEffect } from "react";
import { getChatSocket } from '../../../../../socket/socketManager';
import { registerChatSocketEvents } from "../../../../../socket/socketEvents";

export const useSocketMessages = () => {
  useEffect(() => {
    const chatSocket = getChatSocket();
    if (!chatSocket) {
      console.log("Chat socket not available");
      return;
    }

    const cleanup = registerChatSocketEvents(chatSocket);

    return cleanup;
  }, []);
};