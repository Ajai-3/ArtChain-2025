import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/user";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  supportingCount: number;
  supportersCount: number;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  supportingCount: 0,
  supportersCount: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: { payload: { accessToken: string; user: User } }
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setCurrentUser: (state, action: { payload: User }) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: { payload: string }) => {
      state.accessToken = action.payload;
    },
    updateProfile: (state, action: { payload: { user: User } }) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, setCurrentUser, updateProfile, logout } =
  userSlice.actions;
export default userSlice.reducer;
