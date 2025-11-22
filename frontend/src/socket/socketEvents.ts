import { store } from "../redux/store";
import { Socket } from "socket.io-client";
import {
  addNotification,
  setUnreadCount,
} from "../redux/slices/notificationSlice";
import { addMessage, addOrReplaceMessage } from "../redux/slices/chatSlice";
import type { Message } from "../types/chat/chat";


export const registerChatSocketEvents = (socket: Socket) => {
  socket.on("connect", () =>
    console.log("✅ Chat socket connected:", socket.id)
  );

  socket.on("chatOnline", (users: string[]) => {
    console.log("👥 Online users in chat socket:", users);
  });

  socket.on("newMessage", (message: Message, tempId: string) => {
    console.log("🔔 New message received:", message, tempId);
    store.dispatch(
      addOrReplaceMessage({
        ...message,
        tempId,
      })
    );
  });

  socket.on("connect_error", (err) =>
    console.error("❌ Chat socket error:", err.message)
  );
};

export const registerNotificationSocketEvents = (socket: Socket) => {
  socket.on("connect", () =>
    console.log("✅ Notification socket connected:", socket.id)
  );

  socket.on("notification", (data) => {
    console.log("🔔 Notification received:", data);
    store.dispatch(addNotification(data));
  });

  socket.on("onlineUsers", (users: string[]) => {
    console.log("👥 Online users:", users);
  });

  socket.on("unreadCount", (count: number) => {
    store.dispatch(setUnreadCount(count));
  });

  socket.on("connect_error", (err) =>
    console.error("❌ Notification socket error:", err.message)
  );
};