import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

// Base selectors
const selectMessagesMap = (state: RootState) => state.chat.messages;
const selectConversations = (state: RootState) => state.chat.conversations;

// Factory selector for messages by conversation
export const makeSelectMessagesByConversation = (conversationId: string) =>
  createSelector(
    [selectMessagesMap],
    (messagesMap) => messagesMap[conversationId] ?? []
  );

// Factory selector for last message in a conversation
export const makeSelectLastMessage = (conversationId: string) =>
  createSelector(
    [makeSelectMessagesByConversation(conversationId)],
    (messages) => messages[messages.length - 1] ?? null
  );

// Factory selector for conversation by id
export const makeSelectConversationById = (conversationId: string) =>
  createSelector(
    [selectConversations],
    (conversations) =>
      conversations.find((c) => c.id === conversationId) ?? null
  );
