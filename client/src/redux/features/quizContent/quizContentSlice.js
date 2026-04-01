// src/redux/features/quizContent/quizContentSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchQuizzesAsync } from "./quizContentThunks";

export const contentInitialState = {
  isLoading: false,
  quizzes: [],
  fetchError: null,
};

const quizContentSlice = createSlice({
  name: "quizContent",
  initialState: contentInitialState,

  reducers: {
    resetQuizContent: () => contentInitialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesAsync.pending, (state) => {
        state.isLoading = true;
        state.quizzes = [];
        state.fetchError = null;
      })
      .addCase(fetchQuizzesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
        state.fetchError = null;
      })
      .addCase(fetchQuizzesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError = action.payload;
      });
  },
});

export const { resetQuizContent } = quizContentSlice.actions;

export default quizContentSlice.reducer;
