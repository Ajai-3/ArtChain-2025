import { store } from '../redux/store';
import { Socket } from 'socket.io-client';
import {
  addNotification,
  setUnreadCount,
} from '../redux/slices/notificationSlice';
import {
  addConversation,
  addOrReplaceMessage,
  markMessagesAsRead,
} from '../redux/slices/chatSlice';
import type { Message } from '../types/chat/chat';
import {
  updateOnlineUsers,
  addTypingUser,
  removeTypingUser,
} from '../features/user/hooks/chat/presenceStore';
import { addBid, auctionEnded } from '../redux/slices/biddingSlice';

export const registerChatSocketEvents = (socket: Socket) => {
  socket.on('connect', () =>
    console.log('✅ Chat socket connected:', socket.id),
  );

  socket.on('chatOnline', (users: string[]) => {
    updateOnlineUsers(users);
  });

  socket.on('updateOnline', (users: string[]) => {
    updateOnlineUsers(users);
  });

  socket.on('newMessage', (message: Message, tempId: string) => {
    store.dispatch(
      addOrReplaceMessage({
        ...message,
        tempId,
      }),
    );
  });

  socket.on('userTyping', ({ userId, conversationId }: any) => {
    if (conversationId) {
      addTypingUser(conversationId, userId);
      setTimeout(() => removeTypingUser(conversationId, userId), 3000);
    }
  });

  socket.on('messagesRead', ({ conversationId, messageIds, readBy }: any) => {
    store.dispatch(
      markMessagesAsRead({
        conversationId,
        messageIds,
        readBy,
      }),
    );
  });

  socket.on('newPrivateConversation', (conversation: any) => {
    store.dispatch(addConversation(conversation));
  });

  socket.on('newGroupConversation', (conversation: any) => {
    store.dispatch(addConversation(conversation));
  });

  socket.on('connect_error', (err) =>
    console.error('❌ Chat socket error:', err.message),
  );

  return () => {
    socket.removeAllListeners('connect');
    socket.removeAllListeners('chatOnline');
    socket.removeAllListeners('updateOnline');
    socket.removeAllListeners('newMessage');
    socket.removeAllListeners('userTyping');
    socket.removeAllListeners('messagesRead');
    socket.removeAllListeners('newPrivateConversation');
    socket.removeAllListeners('newGroupConversation');
    socket.removeAllListeners('connect_error');
  };
};

export const registerNotificationSocketEvents = (socket: Socket) => {
  socket.on('connect', () =>
    console.log('✅ Notification socket connected:', socket.id),
  );

  socket.on('notification', (data) => {
    store.dispatch(addNotification(data));
  });

  socket.on('onlineUsers', (users: string[]) => {
    console.log('👥 Online users:', users);
  });

  socket.on('unreadCount', (count: number) => {
    store.dispatch(setUnreadCount(count));
  });

  socket.on('connect_error', (err) =>
    console.error('❌ Notification socket error:', err.message),
  );
};

export const registerBiddingSocketEvents = (socket: Socket) => {
  socket.on('connect', () =>
    console.log('✅ Bidding socket connected:', socket.id),
  );

  socket.on('bid_placed', (newBid: any) => {
    store.dispatch(addBid(newBid));
  });

  socket.on('auction_ended', (data: any) => {
    store.dispatch(auctionEnded(data));
  });

  socket.on('connect_error', (err) =>
    console.error('❌ Bidding socket error:', err.message),
  );
};
