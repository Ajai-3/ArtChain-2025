import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  admin: null,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
      state.error = null;
    },
    loginFailed(state, action) {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    setAdminAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    adminLogout(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.admin = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailed, adminLogout, setAdminAccessToken } =
  adminSlice.actions;
export default adminSlice.reducer;
