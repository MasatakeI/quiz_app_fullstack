// src/redux/features/quizProgress/quizProgressSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { judgeCorrectAnswer } from "@/models/QuizModel";
import { fetchQuizzesAsync } from "../quizContent/quizContentThunks";
import { resetQuizContent } from "../quizContent/quizContentSlice";

export const progressInitialState = {
  currentIndex: 0,
  numberOfCorrects: 0,
  numberOfIncorrects: 0,
  userAnswers: [],
};

const quizProgressSlice = createSlice({
  name: "quizProgress",
  initialState: progressInitialState,

  reducers: {
    goToNextQuiz: (state) => {
      state.currentIndex += 1;
    },

    submitAnswer: (state, action) => {
      const { currentQuiz, selectedAnswer, allAnswers } = action.payload;

      const isCorrect = judgeCorrectAnswer(currentQuiz, selectedAnswer);

      if (isCorrect) {
        state.numberOfCorrects += 1;
      } else {
        state.numberOfIncorrects += 1;
      }

      state.userAnswers.push({
        question: currentQuiz.question,
        correctAnswer: currentQuiz.correctAnswer,
        selectedAnswer,
        allAnswers,
        isCorrect,
      });
    },

    resetProgress: () => progressInitialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesAsync.pending, () => progressInitialState)
      .addCase(resetQuizContent, () => progressInitialState);
  },
});

export const { goToNextQuiz, submitAnswer, resetProgress } =
  quizProgressSlice.actions;

export default quizProgressSlice.reducer;
