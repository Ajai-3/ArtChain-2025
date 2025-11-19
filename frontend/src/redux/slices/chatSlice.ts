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
  selectedConversationId: string | null;
  userCache: Record<string, User>;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  selectedConversationId: null,
  userCache: {},
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
    updateMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      if (!state.messages[m.conversationId])
        state.messages[m.conversationId] = [];
      const i = state.messages[m.conversationId].findIndex(
        (x) => x.id === m.id
      );
      if (i > -1) state.messages[m.conversationId][i] = m;
      else state.messages[m.conversationId].push(m);
    },
    addMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      if (!state.messages[m.conversationId])
        state.messages[m.conversationId] = [];
      if (!state.messages[m.conversationId].some((x) => x.id === m.id)) {
        state.messages[m.conversationId].push(m);
      }
    },
    addMessages(
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) {
      const { conversationId, messages } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      const ids = new Set(state.messages[conversationId].map((m) => m.id));
      state.messages[conversationId].push(
        ...messages.filter((m) => !ids.has(m.id))
      );
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
  addMessages,
  cacheUsers,
  cacheUser,
} = chatSlice.actions;

export default chatSlice.reducer;
