import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectChatState = (state: RootState) => state.chat;
export const selectUserState = (state: RootState) => state.user;

export const selectMessages = createSelector(
  [selectChatState],
  (chat) => chat.messages
);

export const selectCurrentUserId = createSelector(
  [selectUserState],
  (user) => user.user?.id
);

export const selectConversations = createSelector(
  [selectChatState],
  (chat) => chat.conversations
);

export const selectUserCache = createSelector(
  [selectChatState],
  (chat) => chat.userCache ?? {}
);

export const selectMessagesByConversationId = createSelector(
  [selectMessages, (_, conversationId: string) => conversationId],
  (messages, conversationId) => messages[conversationId] || []
);
