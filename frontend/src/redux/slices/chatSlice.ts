import { logout } from "./userSlice";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Conversation, type Message } from "../../types/chat/chat";

interface ChatState {
  conversations: Conversation[]; // Changed to array
  messages: Record<string, Message[]>;
  selectedConversationId: string | null;
}

const initialState: ChatState = {
  conversations: [], // Empty array instead of object
  messages: {},
  selectedConversationId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },

    addConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      const filteredConversations = state.conversations.filter((c) => c.id != conv.id)
      state.conversations = [...filteredConversations, conv];
    },

    updateConversation(state, action: PayloadAction<Conversation>) {
      const conv = action.payload;
      const index = state.conversations.findIndex((c) => c.id === conv.id);

      if (index !== -1) {
        const updatedConversations = [...state.conversations];
        updatedConversations[index] = conv;
        state.conversations = [
          conv,
          ...updatedConversations.filter((_, i) => i !== index),
        ];
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
      const message = action.payload;
      const convId = message.conversationId;

      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }

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
      state.conversations = [];
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
  addMessage,
  addMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
