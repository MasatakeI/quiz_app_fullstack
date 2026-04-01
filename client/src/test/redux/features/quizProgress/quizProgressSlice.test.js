//quizProgressSlice.test.js

import { describe, test, expect } from "vitest";

import quizProgressReducer, {
  progressInitialState,
  goToNextQuiz,
  submitAnswer,
  resetProgress,
} from "@/redux/features/quizProgress/quizProgressSlice";

import { decodedQuizList } from "@/test/fixtures/quizFixture";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";
import { resetQuizContent } from "@/redux/features/quizContent/quizContentSlice";

const applyPending = (slice, thunk, prev = progressInitialState) =>
  slice(prev, thunk.pending());

describe("quizProgressSlice.jsのテスト", () => {
  test("初期stateの確認", () => {
    expect(progressInitialState).toEqual({
      currentIndex: 0,
      numberOfCorrects: 0,
      numberOfIncorrects: 0,
      userAnswers: [],
    });
  });

  describe("reducers", () => {
    describe("goToNextQuiz", () => {
      test("currentIndexを1進める", () => {
        const action = goToNextQuiz();
        const state = quizProgressReducer(progressInitialState, action);
        expect(state.currentIndex).toBe(1);
      });
    });

    describe("submitAnswer", () => {
      const currentQuiz = decodedQuizList[0];
      const allAnswers = [
        currentQuiz.correctAnswer,
        ...currentQuiz.incorrectAnswers,
      ];

      test.each([
        {
          title: "正解",
          selectedAnswer: currentQuiz.correctAnswer,
          isCorrect: true,
        },
        {
          title: "不正解",
          selectedAnswer: currentQuiz.incorrectAnswers[0],
          isCorrect: false,
        },
      ])("$title の場合(1問目)", ({ selectedAnswer, isCorrect }) => {
        const action = submitAnswer({
          currentQuiz,
          selectedAnswer,
          allAnswers,
        });

        const state = quizProgressReducer(progressInitialState, action);

        expect(state).toEqual({
          currentIndex: 0,
          numberOfCorrects: isCorrect ? 1 : 0,
          numberOfIncorrects: isCorrect ? 0 : 1,
          userAnswers: [
            {
              question: currentQuiz.question,
              correctAnswer: currentQuiz.correctAnswer,
              selectedAnswer,
              isCorrect,
              allAnswers,
            },
          ],
        });
      });

      test("累積:1問目が正解した状態で2問目を誤答した場合", () => {
        const stateAfterFirest = {
          currentIndex: 0,
          numberOfCorrects: 1,
          numberOfIncorrects: 0,
          userAnswers: [
            {
              question: currentQuiz.question,
              correctAnswer: currentQuiz.correctAnswer,
              selectedAnswer: currentQuiz.correctAnswer,
              isCorrect: true,
              allAnswers,
            },
          ],
        };

        const secondQuiz = decodedQuizList[1];
        const secondAllAnswers = [
          secondQuiz.correctAnswer,
          ...secondQuiz.incorrectAnswers,
        ];

        const action0 = goToNextQuiz();
        const stateAfterIndex = quizProgressReducer(stateAfterFirest, action0);

        const action = submitAnswer({
          currentQuiz: secondQuiz,
          selectedAnswer: secondQuiz.incorrectAnswers[0],
          allAnswers: secondAllAnswers,
        });

        const state = quizProgressReducer(stateAfterIndex, action);

        expect(state).toEqual({
          currentIndex: 1,
          numberOfCorrects: 1,
          numberOfIncorrects: 1,
          userAnswers: [
            {
              question: currentQuiz.question,
              correctAnswer: currentQuiz.correctAnswer,
              selectedAnswer: currentQuiz.correctAnswer,
              isCorrect: true,
              allAnswers,
            },
            {
              question: secondQuiz.question,
              correctAnswer: secondQuiz.correctAnswer,
              selectedAnswer: secondQuiz.incorrectAnswers[0],
              isCorrect: false,
              allAnswers: secondAllAnswers,
            },
          ],
        });
      });
    });

    describe("resetProgress", () => {
      test("クイズの進行状況を初期値に戻す", () => {
        const prev = {
          currentIndex: 2,
          numberOfCorrects: 2,
          numberOfIncorrects: 1,
          userAnswers: [
            {
              question: "a",
              correctAnswer: "b",
              selectedAnswer: "c",
              allAnswers: [],
              isCorrect: false,
            },
          ],
        };

        const state = quizProgressReducer(prev, resetProgress());

        expect(state).toEqual(progressInitialState);
      });
    });
  });

  describe("extraReducers", () => {
    const prev = {
      currentIndex: 2,
      numberOfCorrects: 2,
      numberOfIncorrects: 1,
      userAnswers: [],
    };
    test("fetchQuizzesAsync.pendingの時,stateの値をリセットする", () => {
      const pending = applyPending(
        quizProgressReducer,
        fetchQuizzesAsync,
        prev,
      );
      expect(pending).toEqual(progressInitialState);
    });

    test("resetQuizContentが呼ばれた時,,stateの値をリセットする", () => {
      const action = resetQuizContent();
      const state = quizProgressReducer(prev, action);
      expect(state).toEqual(progressInitialState);
    });
  });
});
