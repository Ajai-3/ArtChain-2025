import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import type { RootState } from '../../../../redux/store';
import type { Conversation } from '../../../../types/chat/chat';

export const useSyncConversationsWithQueryCache = () => {
  const queryClient = useQueryClient();
  const conversations = useSelector(
    (state: RootState) => state.chat.conversations,
  );

  useEffect(() => {
    if (conversations.length === 0) return;

    queryClient.setQueryData(['recentConversations'], (oldData: { pages: { conversations: Conversation[]; nextPage: null }[]; pageParams: number[] } | undefined) => {
      if (!oldData?.pages) {
        return {
          pages: [{ conversations, nextPage: null }],
          pageParams: [1],
        };
      }

      const newPages = [...oldData.pages];
      newPages[0] = {
        ...newPages[0],
        conversations: [...conversations],
      };

      return { ...oldData, pages: newPages };
    });
  }, [conversations, queryClient]);
};
