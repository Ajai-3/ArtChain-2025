// hooks/chat/useInitialMessages.ts
import { useEffect, useRef, useCallback } from "react";
import apiClient from "../../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { RootState } from "../../../../redux/store";
import {
  storeMessages,
  loadMoreFromRedux,
  resetVisibleCount,
  setMessagesLoading,
} from "../../../../redux/slices/chatSlice";

export const useInitialMessages = (conversationId: string) => {
  const dispatch = useDispatch();
  const initializedRef = useRef<string | null>(null);

  // Get all messages for this conversation from Redux
  const allMessages = useSelector((state: RootState) =>
    conversationId && state.chat?.messages?.[conversationId]
      ? state.chat.messages[conversationId]
      : []
  );

  // Get visible count from Redux
  const visibleCount = useSelector((state: RootState) =>
    conversationId && state.chat?.visibleCount?.[conversationId]
      ? state.chat.visibleCount[conversationId]
      : 0
  );

  // Get pagination info from Redux
  const pagination = useSelector((state: RootState) =>
    conversationId && state.chat?.pagination?.[conversationId]
      ? state.chat.pagination[conversationId]
      : { currentPage: 0, hasMore: true }
  );

  const loadingMessages = useSelector((state: RootState) =>
    conversationId && state.chat?.loadingMessages?.[conversationId]
      ? state.chat.loadingMessages[conversationId]
      : false
  );

  // Calculate visible messages (last N messages)
  const visibleMessages = allMessages.slice(-visibleCount);

  // Check if we have more messages in Redux
  const hasMoreInRedux = visibleCount < allMessages.length;

  console.log(
    `Hook [${conversationId}]: Showing last ${visibleCount} of ${allMessages.length} messages, hasMoreInRedux: ${hasMoreInRedux}, hasMoreHTTP: ${pagination.hasMore}`
  );

  // React Query for HTTP pagination
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["messages", conversationId],
      queryFn: async ({ pageParam = 1 }) => {
        if (!conversationId) throw new Error("No conversation ID");

        console.log(`HTTP: Fetching page ${pageParam} for ${conversationId}`);
        dispatch(setMessagesLoading({ conversationId, loading: true }));

        try {
          const response = await apiClient.get(
            `/api/v1/chat/message/${conversationId}?page=${pageParam}&limit=10`
          );

          const responseData = response.data.data || response.data;
          const messages = responseData.messages || responseData;
          const hasMore =
            responseData.pagination?.hasMore ?? messages.length === 10;

          console.log(
            `HTTP: Loaded ${messages.length} messages for page ${pageParam}, hasMore: ${hasMore}`
          );

          // Store in Redux
          dispatch(
            storeMessages({
              conversationId,
              messages,
              page: pageParam,
              hasMore,
            })
          );

          return {
            messages,
            pagination: { hasMore, page: pageParam },
          };
        } catch (error) {
          console.error("HTTP Error:", error);
          throw error;
        } finally {
          dispatch(setMessagesLoading({ conversationId, loading: false }));
        }
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.pagination?.hasMore ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: false, // Manual control
    });

  // When conversation changes, reset visible count
  useEffect(() => {
    if (!conversationId) return;

    // Check if this is a new conversation
    if (initializedRef.current !== conversationId) {
      console.log(`Hook: Conversation changed to ${conversationId}`);

      // Step 1: Reset visible count
      dispatch(resetVisibleCount({ conversationId }));

      // Step 2: Check if we already have page 1 in Redux
      const hasPage1 = allMessages.length > 0 && pagination.currentPage >= 1;

      if (!hasPage1) {
        // Case B: No page 1 in Redux, fetch from HTTP
        console.log(`Hook: No page 1 in Redux, fetching from HTTP`);
        fetchNextPage();
      } else {
        // Case A: Already have page 1, show from Redux
        console.log(`Hook: Page 1 found in Redux, showing from cache`);
      }

      initializedRef.current = conversationId;
    }
  }, [
    conversationId,
    allMessages.length,
    pagination.currentPage,
    dispatch,
    fetchNextPage,
  ]);

  // Load more handler
  const loadMoreMessagesHandler = useCallback(() => {
    // Step 1: Check if we have more in Redux
    if (hasMoreInRedux) {
      // Case A: Load from Redux (virtual pagination)
      console.log(`Hook: Loading more from Redux`);
      dispatch(loadMoreFromRedux({ conversationId }));
    } else if (pagination.hasMore && !isFetchingNextPage) {
      // Case B: No more in Redux but server has more, fetch from HTTP
      console.log(
        `Hook: Loading more from HTTP (page ${pagination.currentPage + 1})`
      );
      fetchNextPage();
    } else {
      // Case C: No more messages anywhere
      console.log(`Hook: No more messages to load`);
    }
  }, [
    hasMoreInRedux,
    pagination.hasMore,
    pagination.currentPage,
    isFetchingNextPage,
    conversationId,
    dispatch,
    fetchNextPage,
  ]);

  return {
    messages: visibleMessages,
    allMessages,
    loadMoreMessages: loadMoreMessagesHandler,
    hasMore: hasMoreInRedux || pagination.hasMore,
    isLoading: isLoading && allMessages.length === 0,
    isFetchingMore: isFetchingNextPage,
    isVirtualPagination: hasMoreInRedux,
    error,
    visibleCount,
    totalCount: allMessages.length,
  };
};
