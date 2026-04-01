// client/src/data_fetcher/QuizHistoryFetcher.js

import axiosInstance from "@/api/axiosInstance";

export const fetchQuizHistory = async (userId) => {
  try {
    const response = await axiosInstance.get(`/histories/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postQuizHistory = async (userId, historyData) => {
  try {
    const response = await axiosInstance.post(`/histories`, {
      ...historyData,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteQuizHistories = async (ids) => {
  try {
    const response = await axiosInstance.delete(`/histories`, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
