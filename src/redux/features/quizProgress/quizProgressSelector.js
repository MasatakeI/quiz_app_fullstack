// src/redux/selectors/quizProgress/quizProgressSelector.js

import { createSelector } from "@reduxjs/toolkit";
import { selectAllQuizzes } from "../quizContent/quizContentSelector";
import {
  shuffleAnswers,
  translateCurrentDifficulty,
} from "../../../models/QuizModel";
import { selectQuizSettings } from "../quizSettings/quizSettingsSelector";

export const selectCurrentIndex = (state) => state.quizProgress.currentIndex;
export const selectNumberOfCorrects = (state) =>
  state.quizProgress.numberOfCorrects;
export const selectNumberOfIncorrects = (state) =>
  state.quizProgress.numberOfIncorrects;
export const selectUserAnswers = (state) => state.quizProgress.userAnswers;

export const selectCurrentQuiz = createSelector(
  [selectAllQuizzes, selectCurrentIndex],
  (quizzes, currentIndex) => {
    return quizzes[currentIndex];
  },
);

export const selectShuffledAnswers = createSelector(
  [selectCurrentQuiz],
  (currentQuiz) => {
    if (!currentQuiz) {
      return [];
    }

    return shuffleAnswers(currentQuiz);
  },
);
export const selectTransilateCurrentDifficulty = createSelector(
  [selectCurrentQuiz],
  (currentQuiz) => {
    if (!currentQuiz) {
      return "";
    }

    return translateCurrentDifficulty(currentQuiz);
  },
);

export const selectIsQuizInProgress = createSelector(
  [selectAllQuizzes, selectCurrentIndex],
  (quizzes, currentIndex) => {
    return quizzes.length > 0 && currentIndex < quizzes.length;
  },
);

export const selectIsQuizFinished = createSelector(
  [selectAllQuizzes, selectCurrentIndex],
  (quizzes, currentIndex) => {
    return quizzes.length > 0 && currentIndex >= quizzes.length;
  },
);

export const selectResultData = createSelector(
  [selectQuizSettings, selectNumberOfCorrects, selectAllQuizzes],
  (settings, numberOfCorrects, quizzes) => {
    if (!settings && quizzes.length === 0) return null;

    return {
      category: settings.category,
      difficulty: settings.difficulty,
      type: settings.type,
      score: numberOfCorrects,
      totalQuestions: quizzes.length,
    };
  },
);
