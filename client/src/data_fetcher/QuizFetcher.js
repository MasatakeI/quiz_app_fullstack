// src/data_fetcher/QuizFetcher.js

import axios from "axios";

import { CATEGORY_MAP } from "../constants/quizCategories";

export const API_URL = "https://opentdb.com/api.php?";

export const fetchQuizzes = async (category, type, difficulty, amount) => {
  const categoryId = CATEGORY_MAP[category];
  const params = {
    category: categoryId,
    type,
    difficulty,
    amount,
  };

  if (!categoryId) {
    throw new Error("無効なカテゴリーです");
  }

  try {
    const response = await axios.get(API_URL, { params });
    // console.log(response.data.results);
    return response.data.results;
  } catch (error) {
    // console.error(error);
    // throw error;
    throw new Error("fetch失敗(QuizFetcher)");
  }
};
