// client/src/data_fetcher/QuizHistoryFetcher.ts

import axiosInstance from "@/api/axiosInstance";
import type {
  RawQuizHistory,
  QuizHistoryInput,
} from "@/models/types/quizHistory";

export const fetchQuizHistory = async (
  userId: string,
): Promise<RawQuizHistory[]> => {
  try {
    const response = await axiosInstance.get<RawQuizHistory[]>(
      `/histories/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("fetchQuizHistory Error:", error);
    throw error;
  }
};

export const postQuizHistory = async (
  userId: string,
  historyData: QuizHistoryInput,
): Promise<RawQuizHistory> => {
  try {
    const response = await axiosInstance.post<RawQuizHistory>(`/histories`, {
      ...historyData,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("postQuizHistory Error:", error);
    throw error;
  }
};

interface DeleteResponse {
  ids: string[];
}

export const deleteQuizHistories = async (
  ids: string[],
): Promise<DeleteResponse> => {
  try {
    const response = await axiosInstance.delete<DeleteResponse>(`/histories`, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error("deleteQuizHistories Error:", error);
    throw error;
  }
};
