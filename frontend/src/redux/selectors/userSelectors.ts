import type { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectArtWorkCount = (state: RootState) => state.user.artWorkCount;
export const selectSupportingCount = (state: RootState) => state.user.supportingCount;
export const selectSupportersCount = (state: RootState) => state.user.supportersCount;
