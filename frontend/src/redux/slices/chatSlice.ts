import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: {} as Record<string, any>,
  selectedConversationId: null as string | null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations(state, action) {
      action.payload.forEach((conv: any) => {
        state.conversations[conv.id] = conv;
      });
    },

    addConversation(state, action) {
      const conv = action.payload;
      state.conversations[conv.id] = conv;
    },

    updateConversation(state, action) {
      const conv = action.payload;
      state.conversations[conv.id] = conv;
    },

    setSelectedConversation(state, action) {
      state.selectedConversationId = action.payload;
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversation,
  setSelectedConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
