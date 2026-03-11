import { showSnackbar } from "../snackbar/snackbarSlice";
import { createModelThunk } from "../utils/createModelThunk";

import {
  addHistory,
  fetchHistories,
  deleteHistory,
} from "@/models/QuizHistoryModel";

export const addHistoryAsync = createModelThunk(
  "quizHistory/addHistory",
  async ({ resultData }, thunkApi) => {
    const history = await addHistory(resultData);

    thunkApi.dispatch(showSnackbar("クイズ結果を保存しました"));
    return history;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory } = getState();
      if (!quizHistory.canPost) return false;
    },
  },
);

export const fetchHistoriesAsync = createModelThunk(
  "quizHistory/fetchHistories",
  async () => {
    const histories = await fetchHistories();
    return histories;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory } = getState();
      if (quizHistory.isLoading) {
        return false;
      }
    },
  },
);

export const deleteHistoryAsync = createModelThunk(
  "quizHistory/deleteHistory",
  async ({ id }, thunkApi) => {
    const targetHistory = await deleteHistory(id);

    thunkApi.dispatch(showSnackbar(`クイズ結果の削除に成功しました`));
    return targetHistory;
  },
  {
    condition: (_, { getState }) => {
      const { quizHistory } = getState();
      if (quizHistory.isDeleting) {
        return false;
      }
    },
  },
);
