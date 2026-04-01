// src/redux/features/auth/authSelector.js

export const selectUser = (state) => state.auth.user;
export const selectIsAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;
export const selectIsAuthModalOpen = (state) => state.auth.isAuthModalOpen;
