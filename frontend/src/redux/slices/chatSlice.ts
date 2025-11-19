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
  messages: Record<string, Message[]>; // conversationId -> all messages
  visibleCount: Record<string, number>; // conversationId -> how many to show
  pagination: Record<string, { currentPage: number; hasMore: boolean }>; // conversationId -> pagination state
  selectedConversationId: string | null;
  userCache: Record<string, User>;
  loadingMessages: Record<string, boolean>;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  visibleCount: {},
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

    // Store messages from HTTP response
    storeMessages(
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: Message[];
        page: number;
        hasMore: boolean;
      }>
    ) {
      const { conversationId, messages, page, hasMore } = action.payload;

      // Initialize if doesn't exist
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Merge new messages (avoid duplicates)
      const existingIds = new Set(
        state.messages[conversationId].map((m) => m.id)
      );
      const newMessages = messages.filter((m) => !existingIds.has(m.id));

      // Add new messages and sort by timestamp
      state.messages[conversationId] = [
        ...state.messages[conversationId],
        ...newMessages,
      ].sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );

      // Update pagination
      state.pagination[conversationId] = {
        currentPage: page,
        hasMore,
      };

      // If this is page 1, reset visible count to show last 10
      if (page === 1) {
        state.visibleCount[conversationId] = Math.min(
          10,
          state.messages[conversationId].length
        );
      }

      console.log(
        `Redux: Stored ${messages.length} messages for ${conversationId}, page ${page}, total ${state.messages[conversationId].length}`
      );
    },

    // Add single message (for real-time updates)
    addMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      if (!state.messages[m.conversationId]) {
        state.messages[m.conversationId] = [];
      }

      // Avoid duplicates
      const exists = state.messages[m.conversationId].some(
        (x) => x.id === m.id
      );
      if (!exists) {
        state.messages[m.conversationId].push(m);
        // Sort to maintain order
        state.messages[m.conversationId].sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );

        // Auto-increment visible count for new messages
        if (state.visibleCount[m.conversationId]) {
          state.visibleCount[m.conversationId]++;
        }
      }
    },

    // Update existing message
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

    // Load more messages from Redux (virtual pagination)
    loadMoreFromRedux(
      state,
      action: PayloadAction<{ conversationId: string }>
    ) {
      const { conversationId } = action.payload;
      const current = state.visibleCount[conversationId] || 0;
      const total = state.messages[conversationId]?.length || 0;
      const newVisible = Math.min(current + 10, total);

      state.visibleCount[conversationId] = newVisible;

      console.log(
        `Redux: Load more for ${conversationId}: ${current} -> ${newVisible} of ${total}`
      );
    },

    // Reset visible count (when switching conversations)
    resetVisibleCount(
      state,
      action: PayloadAction<{ conversationId: string }>
    ) {
      const { conversationId } = action.payload;
      const total = state.messages[conversationId]?.length || 0;

      // Always show last 10 messages when resetting
      state.visibleCount[conversationId] = Math.min(10, total);

      console.log(
        `Redux: Reset visible for ${conversationId} to ${state.visibleCount[conversationId]}`
      );
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
  loadMoreFromRedux,
  resetVisibleCount,
  setMessagesLoading,
  cacheUsers,
  cacheUser,
} = chatSlice.actions;

export default chatSlice.reducer;
