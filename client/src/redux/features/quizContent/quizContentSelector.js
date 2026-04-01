export const selectQuizContent = (state) => state.quizContent;

export const selectIsLoading = (state) => state.quizContent.isLoading;
export const selectAllQuizzes = (state) => state.quizContent.quizzes;
export const selectFetchError = (state) => state.quizContent.fetchError;
