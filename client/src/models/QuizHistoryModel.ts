//client/src/models/QuizHistoryModel.ts

import { QuizHistoryError } from "./errors/quizHistory/QuizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "./errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "./errors/quizHistory/mapQuizHistoryError";

import {
  fetchQuizHistory,
  postQuizHistory,
  deleteQuizHistories,
} from "@/data_fetcher/QuizHistoryFetcher";

import { format } from "date-fns";

export interface RawQuizHistory {
  id: string;
  category: string;
  difficulty: string;
  type: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface QuizHistoryModel {
  id: string;
  category: string;
  date: string;
  difficulty: string;
  type: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}

export type QuizHistoryInput = Omit<RawQuizHistory, "id" | "date">;

export const createHistory = (
  id: string,
  data: Partial<RawQuizHistory>,
): QuizHistoryModel => {
  const isValid =
    (data && id && typeof data.difficulty === "string") ||
    typeof data.score === "number" ||
    typeof data.totalQuestions === "number" ||
    typeof data.date === "string";

  if (!isValid) {
    throw new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
      message: "サーバーから受け取ったデータが不正です",
    });
  }

  const { score, totalQuestions, date, category, difficulty, type } = data;
  const dateObj = new Date(date);
  const finalDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  const formattedDate = format(finalDate, "yyyy/MM/dd HH:mm");

  return {
    id,
    category: category,
    date: formattedDate,
    difficulty,
    type: type,
    score,
    totalQuestions,
    accuracy:
      data.totalQuestions > 0 ? Number((score / totalQuestions).toFixed(2)) : 0,
  };
};

export const addHistory = async (
  userId: string,
  resultData: QuizHistoryInput,
): Promise<QuizHistoryModel> => {
  try {
    const data: RawQuizHistory = await postQuizHistory(userId, resultData);

    const model = createHistory(data.id, data);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const fetchHistories = async (
  userId: string,
): Promise<QuizHistoryModel[]> => {
  try {
    const data: RawQuizHistory[] = await fetchQuizHistory(userId);

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => createHistory(item.id, item));
  } catch (error: unknown) {
    throw mapQuizHistoryError(error);
  }
};

export const performDelete = async (ids: string[]) => {
  if (!ids || ids.length === 0) return [];

  try {
    const response = await deleteQuizHistories(ids);
    return response.ids;
  } catch (error: unknown) {
    throw mapQuizHistoryError(error);
  }
};

export const deleteHistory = (id: string) => performDelete([id]);
export const deleteHistories = (ids: string[]) => performDelete(ids);
