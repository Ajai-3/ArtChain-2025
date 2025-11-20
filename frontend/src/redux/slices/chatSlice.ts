// redux/slices/chatSlice.ts
import { logout } from "./userSlice";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type Conversation,
  type Message,
  type User,
} from "../../types/chat/chat";

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  pagination: Record<string, { hasMore: boolean; nextFromId?: string }>;
  selectedConversationId: string | null;
  userCache: Record<string, User>;
  loadingMessages: Record<string, boolean>;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  pagination: {},
  selectedConversationId: null,
  userCache: {},
  loadingMessages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },

    addConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations.push(...action.payload);
    },

    addConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      const idx = state.conversations.findIndex((c) => c.id === conv.id);
      if (idx !== -1) state.conversations.splice(idx, 1);
      state.conversations.unshift(conv);
    },

    updateConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      const idx = state.conversations.findIndex((c) => c.id === conv.id);
      if (idx !== -1) state.conversations.splice(idx, 1);
      state.conversations.unshift(conv);
    },

    setSelectedConversation(state, action: PayloadAction<string | null>) {
      state.selectedConversationId = action.payload;
    },

    cacheUsers(state, action: PayloadAction<User[]>) {
      action.payload.forEach((u) => {
        state.userCache[u.id] = u;
      });
    },

    cacheUser(state, action: PayloadAction<User>) {
      state.userCache[action.payload.id] = action.payload;
    },

    storeMessages(
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: Message[];
        hasMore: boolean;
        nextFromId?: string;
      }>
    ) {
      const { conversationId, messages, hasMore, nextFromId } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      const existingIds = new Set(
        state.messages[conversationId].map((m) => m.id)
      );
      const newMessages = messages.filter((m) => !existingIds.has(m.id));

      state.messages[conversationId] = [
        ...newMessages,
        ...state.messages[conversationId],
      ].sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );

      state.pagination[conversationId] = {
        hasMore,
        nextFromId,
      };

      console.log(
        `Redux: Stored ${newMessages.length} messages for ${conversationId}, total ${state.messages[conversationId].length}, hasMore: ${hasMore}, nextFromId: ${nextFromId}`
      );
    },

    addMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      if (!state.messages[m.conversationId]) {
        state.messages[m.conversationId] = [];
      }

      const exists = state.messages[m.conversationId].some(
        (x) => x.id === m.id
      );
      if (!exists) {
        state.messages[m.conversationId].push(m);
        state.messages[m.conversationId].sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );
      }
    },
    addOrReplaceMessage(
      state,
      action: PayloadAction<Message & { tempId?: string }>
    ) {
      const m = action.payload;
      if (!state.messages[m.conversationId]) {
        state.messages[m.conversationId] = [];
      }

      if (m.tempId) {
        const idx = state.messages[m.conversationId].findIndex(
          (x) => x.tempId === m.tempId
        );
        if (idx !== -1) {
          state.messages[m.conversationId][idx] = m;
        } else {
          state.messages[m.conversationId].push(m);
        }
      } else {
        const exists = state.messages[m.conversationId].some(
          (x) => x.id === m.id
        );
        if (!exists) state.messages[m.conversationId].push(m);
      }

      state.messages[m.conversationId].sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );

      const convIdx = state.conversations.findIndex(
        (c) => c.id === m.conversationId
      );
      if (convIdx !== -1) {
        state.conversations[convIdx] = {
          ...state.conversations[convIdx],
          lastMessage: m,
        };
      }
    },

    updateMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      if (!state.messages[m.conversationId]) return;

      const idx = state.messages[m.conversationId].findIndex(
        (x) => x.id === m.id
      );
      if (idx > -1) {
        state.messages[m.conversationId][idx] = m;
      }
    },

    setMessagesLoading(
      state,
      action: PayloadAction<{ conversationId: string; loading: boolean }>
    ) {
      const { conversationId, loading } = action.payload;
      state.loadingMessages[conversationId] = loading;
    },

    clearConversations(state) {
      state.conversations = [];
      state.messages = {};
      state.pagination = {};
      state.loadingMessages = {};
    },
  },
  extraReducers: (builder) => builder.addCase(logout, () => initialState),
});

export const {
  setConversations,
  addConversations,
  addConversation,
  updateConversation,
  setSelectedConversation,
  clearConversations,
  updateMessage,
  addMessage,
  storeMessages,
  addOrReplaceMessage,
  setMessagesLoading,
  cacheUsers,
  cacheUser,
} = chatSlice.actions;

export default chatSlice.reducer;
