//quizProgressSelector.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  selectCurrentQuiz,
  selectShuffledAnswers,
  selectTransilateCurrentDifficulty,
  selectIsQuizFinished,
  selectIsQuizInProgress,
  selectQuizProgressPercent,
  selectResultData,
  selectCurrentIndex,
  selectNumberOfCorrects,
  selectNumberOfIncorrects,
  selectUserAnswers,
} from "@/redux/features/quizProgress/quizProgressSelector";
import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";

import { decodedQuizList } from "../../../fixtures/quizFixture";
import { progressInitialState } from "../../../../redux/features/quizProgress/quizProgressSlice";
import { shuffleAnswers, translateCurrentDifficulty } from "@/models/QuizModel";
import { settingsInitialState } from "@/redux/features/quizSettings/quizSettingsSlice";

vi.mock("@/models/QuizModel", () => ({
  shuffleAnswers: vi.fn(() => ["A", "B", "C", "D"]),
  translateCurrentDifficulty: vi.fn(() => "かんたん"),
}));

describe("quizProgressSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const prev = {
    quizContent: {
      ...contentInitialState,
      quizzes: decodedQuizList,
    },
    quizProgress: {
      ...progressInitialState,
      currentIndex: 1,
    },
    quizSettings: {
      ...settingsInitialState,
      category: "sports",
      type: "multiple",
      difficulty: "easy",
      amount: "3",
    },
  };

  describe("単体selector", () => {
    test("各基本セレクターが正しい値を返す", () => {
      expect(selectCurrentIndex(prev)).toBe(1);
      expect(selectNumberOfCorrects(prev)).toBe(0);
      expect(selectNumberOfIncorrects(prev)).toBe(0);
      expect(selectUserAnswers(prev)).toEqual([]);
    });
  });

  describe("selectCurrentQuiz", () => {
    test("現在のクイズを返す", () => {
      const result = selectCurrentQuiz(prev);
      expect(result).toEqual({
        difficulty: "easy",
        question:
          "What is a fundamental element of the Gothic style of architecture?",
        correctAnswer: "pointed arch",
        incorrectAnswers: [
          "coffered ceilings",
          "façades surmounted by a pediment ",
          "internal frescoes",
        ],
      });
    });

    test("異常系: インデックスが範囲外なら undefined を返す", () => {
      const outOfBoundsState = {
        ...prev,
        quizProgress: { ...prev.quizProgress, currentIndex: 99 },
      };
      expect(selectCurrentQuiz(outOfBoundsState)).toBeUndefined();
    });
  });

  describe("selectShuffledAnswers", () => {
    test("現在のクイズからシャッフルされた選択肢を返す", () => {
      const currentQuiz =
        prev.quizContent.quizzes[prev.quizProgress.currentIndex];

      const result = selectShuffledAnswers(prev);
      expect(shuffleAnswers).toHaveBeenCalledWith(currentQuiz);
      expect(result).toEqual(["A", "B", "C", "D"]);
    });

    test("currentQuizがない場合,空配列を返す", () => {
      const emptyQuizDataState = {
        quizContent: { ...prev.quizContent, quizzes: [] },
        quizProgress: { ...prev.quizProgress },
      };

      const result = selectShuffledAnswers(emptyQuizDataState);
      expect(result).toEqual([]);
    });
  });

  describe("selectTransilateCurrentDifficulty", () => {
    test("翻訳された現在のクイズの難易度を返す", () => {
      const result = selectTransilateCurrentDifficulty(prev);
      const currentQuiz =
        prev.quizContent.quizzes[prev.quizProgress.currentIndex];
      expect(result).toEqual("かんたん");
      expect(translateCurrentDifficulty).toHaveBeenCalledWith(currentQuiz);
    });

    test("currentQuizがない場合,空文字列を返す", () => {
      const emptyQuizDataState = {
        quizContent: { ...prev.quizContent, quizzes: [] },
        quizProgress: { ...prev.quizProgress },
      };

      const result = selectTransilateCurrentDifficulty(emptyQuizDataState);
      expect(result).toEqual("");
    });
  });

  describe("selectIsQuizFinished", () => {
    test("クイズが終了したかを返す:終了していない場合", () => {
      const result = selectIsQuizFinished(prev);
      expect(result).toBe(false);
    });
    test("クイズが終了したかを返す:終了してた場合", () => {
      const finishedState = {
        quizContent: { ...prev.quizContent },
        quizProgress: { ...prev.quizProgress, currentIndex: 3 },
      };
      const result = selectIsQuizFinished(finishedState);
      expect(result).toBe(true);
    });

    test("クイズが1問の場合の境界値:終了した場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 1 },
      };

      const result = selectIsQuizFinished(oneQuizState);
      expect(result).toBe(true);
    });
    test("クイズが1問の場合の境界値:終了していない場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 0 },
      };

      const result = selectIsQuizFinished(oneQuizState);
      expect(result).toBe(false);
    });

    test("クイズがない場合:falseを返す", () => {
      const result = selectIsQuizFinished({
        ...prev,
        quizContent: {
          ...contentInitialState,
          quizzes: [],
        },
      });
      expect(result).toBe(null);
    });
  });

  describe("selectIsQuizInProgress", () => {
    test("クイズが進行中かを返す:終了している場合", () => {
      const finishedState = {
        quizContent: { ...prev.quizContent },
        quizProgress: { ...prev.quizProgress, currentIndex: 3 },
      };
      const result = selectIsQuizInProgress(finishedState);
      expect(result).toBe(false);
    });
    test("クイズが進行中かを返す:進行中の場合", () => {
      const result = selectIsQuizInProgress(prev);
      expect(result).toBe(true);
    });

    test("クイズが1問の場合の境界値:終了の場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 1 },
      };

      const result = selectIsQuizInProgress(oneQuizState);
      expect(result).toBe(false);
    });
    test("クイズが1問の場合の境界値:進行中の場合", () => {
      const oneQuizState = {
        quizContent: { ...prev.quizContent, quizzes: [decodedQuizList[0]] },
        quizProgress: { ...prev.quizProgress, currentIndex: 0 },
      };

      const result = selectIsQuizInProgress(oneQuizState);
      expect(result).toBe(true);
    });

    test("クイズがない場合:falseを返す", () => {
      const result = selectIsQuizInProgress({
        ...prev,
        quizContent: {
          ...contentInitialState,
          quizzes: [],
        },
      });
      expect(result).toBe(null);
    });
  });

  describe("selectQuizProgressPercent", () => {
    test("クイズの進行割合を返す", () => {
      const result = selectQuizProgressPercent(prev);
      expect(result).toEqual(33);
    });

    test("クイズがない場合:falseを返す", () => {
      const result = selectQuizProgressPercent({
        ...prev,
        quizContent: {
          ...contentInitialState,
          quizzes: [],
        },
      });
      expect(result).toBe(null);
    });

    test("異常系: 開始時は 0 を返す", () => {
      const startState = {
        ...prev,
        quizProgress: { ...prev.quizProgress, currentIndex: 0 },
      };
      expect(selectQuizProgressPercent(startState)).toBe(0);
    });

    test("異常系: 終了時は 100 を返す", () => {
      const endState = {
        ...prev,
        quizProgress: { ...prev.quizProgress, currentIndex: 3 },
      };
      expect(selectQuizProgressPercent(endState)).toBe(100);
    });
  });

  describe("selectQuizResultData", () => {
    test("settingデータをresultDataとして返す", () => {
      const result = selectResultData(prev);
      expect(result).toEqual({
        category: "sports",
        difficulty: "easy",
        score: 0,
        totalQuestions: 3,
        type: "multiple",
      });
    });

    test("settingデータがないかつ quizzesがない時:falseを返す", () => {
      const emptyState = {
        quizContent: { ...contentInitialState },
        quizProgress: { ...progressInitialState },
        quizSettings: null,
      };
      const result = selectResultData(emptyState);
      expect(result).toBe(null);
    });

    test("異常系: カテゴリが空文字（初期状態）なら null を返す", () => {
      const emptyCategoryState = {
        ...prev,
        quizSettings: { ...settingsInitialState, category: "" },
      };
      expect(selectResultData(emptyCategoryState)).toBe(null);
    });
  });
});
