// src/constants/quizCategories.js

export const CATEGORY_MAP = {
  sports: 21,
  general: 9,
  entertainment: 31,
  math: 19,
  comicks: 29,
  music: 12,
};

export const QUIZ_TITLE_MAP = {
  sports: "スポーツ",
  general: "常識",
  entertainment: "エンタメ",
  math: "数学",
  comicks: "マンガ",
  music: "音楽",
};

export const getQuizTitle = (category) => {
  return QUIZ_TITLE_MAP[category];
};
