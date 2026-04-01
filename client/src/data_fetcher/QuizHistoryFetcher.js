// client/src/data_fetcher/QuizHistoryFetcher.js

import axiosInstance from "api/axiosInstance";

export const fetchQuizHistory = async (userId) => {
  try {
    const response = await axiosInstance.get(`/histories/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("fetch失敗(QuizHistoryFetcher)");
  }
};
