// quizContentThunks.js

import { createQuizzes, validateQuizSettings } from "../../../models/QuizModel";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { createModelThunk } from "../utils/createModelThunk";

export const fetchQuizzesAsync = createModelThunk(
  "quizContent/fetchQuizzes",
  async ({ category, type, difficulty, amount }, thunkApi) => {
    validateQuizSettings({ category, type, difficulty, amount });
    const quizzes = await createQuizzes(category, type, difficulty, amount);
    thunkApi.dispatch(showSnackbar("クイズの取得に成功しました"));
    return quizzes;
  },
  {
    condition: (_, { getState }) => {
      const { quizContent } = getState();
      if (quizContent.isLoading === true) {
        return false;
      }
    },
  },
);
