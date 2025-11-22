// Chat.tsx or src/hooks/chat/useSyncConversationList.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import type { RootState } from "../../../../redux/store";
import type { Conversation } from "../../../../types/chat/chat";

export const useSyncConversationsWithQueryCache = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const conversations = useSelector((state: RootState) => state.chat.conversations);

  useEffect(() => {
    if (conversations.length === 0) return;

    queryClient.setQueryData(["recentConversations"], (oldData: any) => {
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