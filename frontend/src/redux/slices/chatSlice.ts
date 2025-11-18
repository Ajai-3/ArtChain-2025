import { logout } from "./userSlice";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Conversation, type Message } from "../../types/chat/chat";

interface ChatState {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>;
  selectedConversationId: string | null;
}

const initialState: ChatState = {
  conversations: {} as Record<string, Conversation>,
  messages: {} as Record<string, Message[]>,
  selectedConversationId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      action.payload.forEach((conv: Conversation) => {
        state.conversations[conv.id] = conv;
      });
    },

    addConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      state.conversations[conv.id] = conv;
    },

    updateConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      if (state.conversations[conv.id]) {
        state.conversations[conv.id] = {
          ...state.conversations[conv.id],
          ...conv,
        };
      }
    },

    setSelectedConversation(state, action: PayloadAction<string | null>) {
      state.selectedConversationId = action.payload;
    },

    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const convId = message.conversationId;

      if (state.messages[convId]) {
        const index = state.messages[convId].findIndex(
          (m) => m.id === message.id
        );
        if (index !== -1) {
          state.messages[convId][index] = message;
        } else {
          state.messages[convId].push(message);
        }
      }
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      // ✅ Correct name
      const message = action.payload;
      const convId = message.conversationId;

      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }

      // Check if exists - if yes, DO NOTHING (or replace if you want)
      const exists = state.messages[convId].some((m) => m.id === message.id);
      if (!exists) {
        state.messages[convId].push(message); 
      }
    },

    addMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: Message[];
      }>
    ) => {
      const { conversationId, messages } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      const existingIds = new Set(
        state.messages[conversationId].map((m) => m.id)
      );
      const newMessages = messages.filter((msg) => !existingIds.has(msg.id));

      state.messages[conversationId] = [
        ...state.messages[conversationId],
        ...newMessages,
      ];
    },

    clearConversations(state) {
      state.conversations = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setSelectedConversation,
  clearConversations,
  updateMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
