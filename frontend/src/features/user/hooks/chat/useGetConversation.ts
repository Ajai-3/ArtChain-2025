import apiClient from '../../../../api/axios';
import { useQuery } from '@tanstack/react-query';


export const useGetConversation = (conversationId: string | null) => {
  return useQuery<any>(
    ['conversation', conversationId],
    async () => {
      if (!conversationId) throw new Error('No conversation ID provided');
      const res = await apiClient.get(`/api/v1/chat/conversation/${conversationId}`);
      console.log("Conversation data:", res.data);
      return res.data;
    },

  );
};
