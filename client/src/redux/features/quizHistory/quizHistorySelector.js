//src/redux/features/quizHistory/quizHistorySelector.js

export const selectHistoryCanPost = (state) => state.quizHistory.canPost;
export const selectHistoryIsLoading = (state) => state.quizHistory.isLoading;
export const selectHistoryIsDeleting = (state) => state.quizHistory.isDeleting;
export const selectAllHistories = (state) => state.quizHistory.histories;
export const selectHistoryError = (state) => state.quizHistory.error;
