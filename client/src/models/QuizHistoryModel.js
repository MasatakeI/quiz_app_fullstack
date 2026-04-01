//client/src/models/QuizHistoryModel.js

import { QuizHistoryError } from "./errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "./errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "./errors/quizHistory/mapQuizHistoryError";

import {
  fetchQuizHistory,
  postQuizHistory,
  deleteQuizHistories,
} from "@/data_fetcher/QuizHistoryFetcher";

import { format } from "date-fns";

export const createHistory = (id, data) => {
  const isValid =
    data &&
    id &&
    typeof data.difficulty === "string" &&
    typeof data.score === "number" &&
    typeof data.totalQuestions === "number" &&
    data.date; // 存在だけ確認（toDateの有無は後で判定）

  if (!isValid) {
    throw new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
      message: "サーバーから受け取ったデータが不正です",
    });
  }

  const dateObj = new Date(data.date);

  const finalDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  const formattedDate = format(finalDate, "yyyy/MM/dd HH:mm");

  return {
    id,
    category: data.category,
    date: formattedDate,
    difficulty: data.difficulty,
    type: data.type,
    score: data.score,
    totalQuestions: data.totalQuestions,
    accuracy:
      data.totalQuestions > 0
        ? Number((data.score / data.totalQuestions).toFixed(2))
        : 0,
  };
};

export const addHistory = async (userId, resultData) => {
  try {
    if (typeof resultData.score !== "number") {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
        message: "スコア情報が不足しています",
      });
    }

    const data = await postQuizHistory(userId, resultData);

    const model = createHistory(data.id, data);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const fetchHistories = async (userId) => {
  try {
    const data = await fetchQuizHistory(userId);

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => createHistory(item.id, item));
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const performDelete = async (ids) => {
  if (!ids || ids.length === 0) return [];

  try {
    const response = await deleteQuizHistories(ids);
    return response.ids;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const deleteHistory = (id) => performDelete([id]);
export const deleteHistories = (ids) => performDelete(ids);
