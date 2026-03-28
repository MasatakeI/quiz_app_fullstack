// src/models/QuizModel.js

import { fetchQuizzes } from "../data_fetcher/QuizFetcher";

import he from "he";
import _ from "lodash";

import { QuizError } from "./errors/quiz/QuizError";
import { QUIZ_ERROR_CODE } from "./errors/quiz/quizErrorCode";
import { DIFFICULTY_LABELS } from "@/constants/quizTranslations";

export const createFormatQuizData = (quizData) => {
  if (!quizData) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.INVALID_DATA,
      message: "クイズデータがありません",
    });
  }

  const requiredFields = [
    "question",
    "correct_answer",
    "incorrect_answers",
    "difficulty",
  ];

  const missingFields = requiredFields.filter((field) => !quizData[field]);

  if (missingFields.length > 0) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.INVALID_DATA,
      message: `クイズデータの必須フィールドが欠落しています: ${missingFields.join(", ")}`,
    });
  }

  return {
    question: he.decode(quizData.question),
    correctAnswer: he.decode(quizData.correct_answer),
    incorrectAnswers: quizData.incorrect_answers.map((answer) =>
      he.decode(answer),
    ),
    difficulty: he.decode(quizData.difficulty),
  };
};

export const createFormattedQuizList = (quizDataList) => {
  if (!Array.isArray(quizDataList)) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.INVALID_DATA,
      message: "クイズリストが配列ではありません",
    });
  }
  return quizDataList.map(createFormatQuizData);
};

export const createQuizzes = async (category, type, difficulty, amount) => {
  try {
    const quizDataList = await fetchQuizzes(category, type, difficulty, amount);

    if (!quizDataList || quizDataList.length === 0) {
      throw new QuizError({
        code: QUIZ_ERROR_CODE.NOT_FOUND,
        message: "該当するクイズが見つかりませんでした",
      });
    }
    return createFormattedQuizList(quizDataList);
  } catch (error) {
    if (error instanceof QuizError) {
      throw error;
    }
    throw new QuizError({
      code: QUIZ_ERROR_CODE.NETWORK,
      message: "ネットワークエラー クイズの取得に失敗しました",
      cause: error,
    });
  }
};

export const validateQuizSettings = ({
  category,
  type,
  difficulty,
  amount,
}) => {
  if (!category) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
      message: "ジャンルを選択してください",
      field: "category",
    });
  }
  if (!type) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
      message: "タイプを選択してください",
      field: "type",
    });
  }
  if (!difficulty) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
      message: "レベルを選択してください",
      field: "difficulty",
    });
  }
  // typeがboolean（二択）以外で、amount（問題数）が未設定、または1未満の場合
  if (type !== "boolean" && (!amount || amount < 1)) {
    throw new QuizError({
      code: QUIZ_ERROR_CODE.VALIDATION,
      message: "問題数を選択してください",
      field: "amount",
    });
  }

  return true;
};

export const judgeCorrectAnswer = (quiz, answer) => {
  if (!quiz) return false;
  return answer === quiz.correctAnswer;
};

export const shuffleAnswers = (quiz) => {
  if (!quiz || !Array.isArray(quiz.incorrectAnswers)) {
    return [];
  }
  return _.shuffle([quiz.correctAnswer, ...quiz.incorrectAnswers]);
};

export const translateCurrentDifficulty = (quiz) => {
  return DIFFICULTY_LABELS[quiz.difficulty] ?? "不明";
};
