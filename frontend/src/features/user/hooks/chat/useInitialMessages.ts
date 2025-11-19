import apiClient from "../../../../api/axios";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import {
  storeMessages,
  setMessagesLoading,
} from "../../../../redux/slices/chatSlice";

export const useInitialMessages = (conversationId: string) => {
  const dispatch = useDispatch();
  const initializedRef = useRef<string | null>(null);

  const allMessages = useSelector(
    (state: RootState) => state.chat.messages[conversationId] || []
  );

  const pagination = useSelector(
    (state: RootState) =>
      state.chat.pagination[conversationId] || { hasMore: true }
  );

  const loadingMessages =
    useSelector(
      (state: RootState) => state.chat.loadingMessages[conversationId]
    ) || false;

  const fetchMessages = useCallback(
    async (fromId?: string) => {
      if (!conversationId) return;

      dispatch(setMessagesLoading({ conversationId, loading: true }));

      try {
        const url = fromId
          ? `/api/v1/chat/message/${conversationId}?limit=10&fromId=${fromId}`
          : `/api/v1/chat/message/${conversationId}?limit=10`;

        const res = await apiClient.get(url);
        const data = res.data.data || res.data;
        const messages = data.messages || [];
        const nextFromId = data.pagination?.nextFromId;
        const hasMore = data.pagination?.hasMore ?? messages.length > 0;

        dispatch(
          storeMessages({
            conversationId,
            messages,
            hasMore,
            nextFromId,
          })
        );

        return messages;
      } catch (err) {
        console.error("Message fetch failed", err);
        throw err;
      } finally {
        dispatch(setMessagesLoading({ conversationId, loading: false }));
      }
    },
    [conversationId, dispatch]
  );

  useEffect(() => {
    if (!conversationId) return;

    if (initializedRef.current !== conversationId) {
      const alreadyFetched = allMessages.length > 0;

      if (!alreadyFetched) {
        fetchMessages();
      }

      initializedRef.current = conversationId;
    }
  }, [conversationId, allMessages.length, fetchMessages]);

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore) return;
    if (!pagination.nextFromId) return;
    if (loadingMessages) return;

    await fetchMessages(pagination.nextFromId);
  }, [pagination, loadingMessages, fetchMessages]);

  return {
    messages: allMessages,
    loadMoreMessages: loadMore,
    hasMore: pagination.hasMore,
    isLoading: allMessages.length === 0 && loadingMessages,
    isFetchingMore: loadingMessages,
    nextFromId: pagination.nextFromId,
    totalCount: allMessages.length,
  };
};
