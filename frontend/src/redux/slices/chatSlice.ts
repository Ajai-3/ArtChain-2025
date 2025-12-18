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
      const incoming = action.payload;

      console.log("🔵 [Reducer] Incoming payload:", incoming);

      if (!state.messages[incoming.conversationId]) {
        console.log("🆕 Initializing new array for conversation");
        state.messages[incoming.conversationId] = [];
      }

      const list = state.messages[incoming.conversationId];
      console.log("📦 Current list before update:", list);

      if (incoming.tempId) {
        console.log("🟣 Incoming has tempId:", incoming.tempId);

        const idx = list.findIndex((m) => m.tempId === incoming.tempId);
        console.log("🔍 Match by tempId index:", idx);

        if (idx !== -1) {
          console.log("♻️ Replacing optimistic message");
          list[idx] = { ...incoming, tempId: undefined };
        } else {
          console.log("➕ No optimistic match found, pushing real message");
          list.push({ ...incoming, tempId: undefined });
        }
      } else {
        console.log("🟠 Incoming has NO tempId, normal message");
        const idx = list.findIndex((m) => m.id === incoming.id);
        
        if (idx !== -1) {
          console.log("🔄 Message exists, updating:", incoming.id);
          list[idx] = incoming;
        } else {
          console.log("➕ Adding real message to list");
          list.push(incoming);
        }
      }

      list.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      console.log("📚 Sorted list:", list);

      const convIdx = state.conversations.findIndex(
        (c) => c.id === incoming.conversationId
      );
      console.log("🔍 conversation index:", convIdx);

      if (convIdx !== -1) {
        console.log("🟢 Updating lastMessage for conversation");
        state.conversations[convIdx] = {
          ...state.conversations[convIdx],
          lastMessage: { ...incoming, tempId: undefined },
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateMessage(state, action: PayloadAction<Partial<Message> & { id: string; conversationId: string }>) {
      const m = action.payload;
      if (!state.messages[m.conversationId]) return;

      const idx = state.messages[m.conversationId].findIndex(
        (x) => x.id === m.id
      );
      if (idx > -1) {
        const updatedMessage = {
          ...state.messages[m.conversationId][idx],
          ...m,
        };
        state.messages[m.conversationId][idx] = updatedMessage;

        // Update lastMessage if it matches
        const convIdx = state.conversations.findIndex(c => c.id === m.conversationId);
        if (convIdx > -1) {
           const conv = state.conversations[convIdx];
           if (conv.lastMessage?.id === m.id) {
              state.conversations[convIdx].lastMessage = {
                 ...conv.lastMessage,
                 ...updatedMessage
              };
           }
        }
      }
    },

    setMessagesLoading(
      state,
      action: PayloadAction<{ conversationId: string; loading: boolean }>
    ) {
      const { conversationId, loading } = action.payload;
      state.loadingMessages[conversationId] = loading;
    },

    markMessagesAsRead(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageIds: string[];
        readBy: string;
      }>
    ) {
      const { conversationId, messageIds, readBy } = action.payload;
      
      // Update messages
      if (state.messages[conversationId]) {
        state.messages[conversationId].forEach((msg) => {
          if (messageIds.includes(msg.id)) {
             if (!msg.readBy) msg.readBy = [];
             if (!msg.readBy.includes(readBy)) {
               msg.readBy.push(readBy);
             }
          }
        });
      }

      // Update conversation unread count if read by current user
      // We don't have currentUserId here easily, but we can assume if this action is dispatched
      // for the current user's view, we might want to update.
      // However, usually unreadCount is for the *current* user. 
      // If *I* read messages, my unreadCount for this convo goes to 0.
      // If *Partner* reads my messages, my unreadCount doesn't change, but I see blue ticks.
      
      // Let's just update the messages for now. The unread count logic might be handled separately 
      // or we can set it to 0 if we know it's the current user.
      // Actually, if we are in the conversation, unread count should be 0.
      
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
         // Logic for unread count update
      }
    },

    setConversationUnreadCount(
      state,
      action: PayloadAction<{ conversationId: string; count: number }>
    ) {
      const { conversationId, count } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.unreadCount = count;
      }
    },

    removeMessage(state, action: PayloadAction<{ conversationId: string; messageId: string }>) {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          (m) => m.id !== messageId
        );
      }
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv && conv.lastMessage?.id === messageId) {
         const messages = state.messages[conversationId];
         conv.lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      }
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
  markMessagesAsRead,
  setConversationUnreadCount,
  removeMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
