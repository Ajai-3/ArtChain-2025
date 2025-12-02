import { useState, useEffect } from 'react';
import { subscribe, isUserOnline, getTypingUsers, getOnlineUsers } from './presenceStore';

export function usePresence(userId?: string, conversationId?: string) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate(n => n + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline: userId ? isUserOnline(userId) : false,
    typingUsers: conversationId ? getTypingUsers(conversationId) : [],
    onlineUsers: getOnlineUsers(),
  };
}
