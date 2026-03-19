import { createSlice } from "@reduxjs/toolkit";
import {
  addHistoryAsync,
  fetchHistoriesAsync,
  deleteHistoryAsync,
  deleteHistoriesAsync,
} from "./quizHistoryThunks";

export const quizHistoryInitialState = {
  canPost: true,
  isLoading: false,
  isDeleting: false,

  histories: [],
  error: null,
};

const quizHistorySlice = createSlice({
  name: "quizHistory",
  initialState: quizHistoryInitialState,

  extraReducers: (builder) => {
    builder

      //addHistory
      .addCase(addHistoryAsync.pending, (state) => {
        state.canPost = false;
      })
      .addCase(addHistoryAsync.fulfilled, (state, action) => {
        state.canPost = true;
        state.histories.push(action.payload);
        state.error = null;
      })

      //fetchHistories
      .addCase(fetchHistoriesAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHistoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.histories = action.payload;
        state.error = null;
      })

      //delete系pending共通処理
      .addMatcher(
        (action) =>
          [
            deleteHistoryAsync.pending.type,
            deleteHistoriesAsync.pending.type,
          ].includes(action.type),
        (state) => {
          state.isDeleting = true;
        },
      )
      //delete系 fulfilled 共通処理
      .addMatcher(
        (action) =>
          [
            deleteHistoryAsync.fulfilled.type,
            deleteHistoriesAsync.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.isDeleting = false;

          const deleteIds = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
          state.histories = state.histories.filter((his) => {
            return !deleteIds.includes(his.id);
          });

          state.error = null;
        },
      )

      //rejected共通処理
      .addMatcher(
        (action) =>
          action.type.startsWith("quizHistory/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.canPost = true;
          state.isLoading = false;
          state.isDeleting = false;
          state.error = action.payload;
        },
      );
  },
});

export default quizHistorySlice.reducer;
