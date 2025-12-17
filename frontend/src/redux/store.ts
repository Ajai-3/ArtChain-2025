import wallet from "./slices/walletSlice";
import userSlice from "./slices/userSlice";
import chatSlice from "./slices/chatSlice";
import adminSlice from "./slices/adminSlice";
import notificationSlice from "./slices/notificationSlice";
import biddingSlice from "./slices/biddingSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  wallet: wallet,
  user: userSlice,
  chat: chatSlice,
  admin: adminSlice,
  notification: notificationSlice,
  bidding: biddingSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

