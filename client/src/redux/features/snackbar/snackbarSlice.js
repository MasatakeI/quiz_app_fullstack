import { createSlice } from "@reduxjs/toolkit";

export const snackbarInitialState = {
  snackbarOpen: false,
  snackbarMessage: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: snackbarInitialState,

  reducers: {
    showSnackbar: (state, action) => {
      state.snackbarOpen = true;
      state.snackbarMessage = action.payload;
    },
    hideSnackbar: (state) => {
      state.snackbarOpen = false;
      state.snackbarMessage = "";
    },
  },
});

export const selectSnackbarOpen = (state) => state.snackbar.snackbarOpen;
export const selectSnackbarMessage = (state) => state.snackbar.snackbarMessage;

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
