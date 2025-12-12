import wallet from "./slices/walletSlice";
import userSlice from "./slices/userSlice";
import chatSlice from "./slices/chatSlice";
import storage from "redux-persist/lib/storage";
import adminSlice from "./slices/adminSlice";
import notificationSlice from "./slices/notificationSlice";
import biddingSlice from "./slices/biddingSlice";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  wallet: wallet,
  user: userSlice,
  chat: chatSlice,
  admin: adminSlice,
  notification: notificationSlice,
  bidding: biddingSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
