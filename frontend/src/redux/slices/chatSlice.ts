import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Conversation } from "../../types/chat/chat";

interface ChatState {
  conversations: Record<string, Conversation>;
  selectedConversationId: string | null;
}

const initialState: ChatState = {
  conversations: {} as Record<string, Conversation>,
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

    // Add this for infinite loading - append new conversations without duplicates
    appendConversations(state, action: PayloadAction<Conversation[]>) {
      action.payload.forEach((conv: Conversation) => {
        // Only add if it doesn't exist to avoid duplicates
        if (!state.conversations[conv.id]) {
          state.conversations[conv.id] = conv;
        }
      });
    },

    // Clear all conversations
    clearConversations(state) {
      state.conversations = {};
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setSelectedConversation,
  appendConversations,
  clearConversations,
} = chatSlice.actions;

export default chatSlice.reducer;
