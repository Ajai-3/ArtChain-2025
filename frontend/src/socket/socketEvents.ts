import { store } from "../redux/store";
import { Socket } from "socket.io-client";
import {
  addNotification,
  setUnreadCount,
} from "../redux/slices/notificationSlice";
import { addConversation, addOrReplaceMessage, markMessagesAsRead } from "../redux/slices/chatSlice";
import type { Message } from "../types/chat/chat";
import { updateOnlineUsers, addTypingUser, removeTypingUser } from "../features/user/hooks/chat/presenceStore";
import { addBid, auctionEnded } from "../redux/slices/biddingSlice";


export const registerChatSocketEvents = (socket: Socket) => {
  socket.on("connect", () =>
    console.log("✅ Chat socket connected:", socket.id)
  );

  socket.on("chatOnline", (users: string[]) => {
    console.log("👥 Online users in chat socket:", users);
    updateOnlineUsers(users);
  });

  socket.on("updateOnline", (users: string[]) => {
    console.log("🔄 Online users updated:", users);
    updateOnlineUsers(users);
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

  socket.on("userTyping", ({ userId, conversationId }: any) => {
    console.log("⌨️ TYPING EVENT:", userId, "in", conversationId);
    if (conversationId) {
      addTypingUser(conversationId, userId);
      setTimeout(() => removeTypingUser(conversationId, userId), 3000);
    }
  });

  socket.on("messagesRead", ({ conversationId, messageIds, readBy }: any) => {
    console.log("👀 Messages read:", conversationId, messageIds, readBy);
    store.dispatch(
      markMessagesAsRead({
        conversationId,
        messageIds,
        readBy,
      })
    );
  });

  socket.on("newPrivateConversation", (conversation: any) => {
    console.log("🆕 New private conversation received:", conversation);
    store.dispatch(addConversation(conversation));
  });

  socket.on("newGroupConversation", (conversation: any) => {
    console.log("👥 New group conversation received:", conversation);
    store.dispatch(addConversation(conversation));
  });

  socket.on("connect_error", (err) =>
    console.error("❌ Chat socket error:", err.message)
  );

  return () => {
    socket.removeAllListeners("connect");
    socket.removeAllListeners("chatOnline");
    socket.removeAllListeners("updateOnline");
    socket.removeAllListeners("newMessage");
    socket.removeAllListeners("userTyping");
    socket.removeAllListeners("messagesRead");
    socket.removeAllListeners("newPrivateConversation");
    socket.removeAllListeners("newGroupConversation");
    socket.removeAllListeners("connect_error");
  };
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

export const registerBiddingSocketEvents = (socket: Socket) => {
  socket.on("connect", () =>
    console.log("✅ Bidding socket connected:", socket.id)
  );

  socket.on("bid_placed", (newBid: any) => {
    console.log("🔨 New Bid Placed:", newBid);
    store.dispatch(addBid(newBid));
  });

  socket.on("auction_ended", (data: any) => {
      console.log("🏁 Auction Ended:", data);
      store.dispatch(auctionEnded(data));
  });

  socket.on("connect_error", (err) =>
    console.error("❌ Bidding socket error:", err.message)
  );
};