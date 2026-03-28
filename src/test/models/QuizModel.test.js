//QuizModel.test.js

import { vi, describe, test, expect, beforeEach } from "vitest";

import {
  createFormatQuizData,
  createFormattedQuizList,
  createQuizzes,
  judgeCorrectAnswer,
  shuffleAnswers,
  translateCurrentDifficulty,
  validateQuizSettings,
} from "@/models/QuizModel";

import { undecodedQuizList, decodedQuizList } from "../fixtures/quizFixture";
import { fetchQuizzes } from "@/data_fetcher/QuizFetcher";
import { QuizError } from "@/models/errors/quiz/QuizError";
import { QUIZ_ERROR_CODE } from "@/models/errors/quiz/quizErrorCode";

vi.mock("@/data_fetcher/QuizFetcher");

describe("QuizModel.jsのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createFormatQuizData", () => {
    const quizData = undecodedQuizList[0];
    test("成功ケース:HTMLエンティティをデコードし整形されたオブジェクトを返す", () => {
      const result = createFormatQuizData(quizData);
      expect(result).toEqual(decodedQuizList[0]);
    });

    test("失敗ケース:quizDataがない場合エラーをスローする", () => {
      const error = new QuizError({
        code: QUIZ_ERROR_CODE.INVALID_DATA,
        message: "クイズデータがありません",
      });
      expect(() => createFormatQuizData()).toThrow(error);
    });
    test.each([
      "question",
      "correct_answer",
      "incorrect_answers",
      "difficulty",
    ])(
      "失敗ケース:quizDataの必須フィールド(%s)が欠落している場合エラーをスローする",
      (field) => {
        const incompleteQuizData = {
          ...quizData,
          [field]: undefined,
        };
        const error = new QuizError({
          code: QUIZ_ERROR_CODE.INVALID_DATA,
          message: `クイズデータの必須フィールドが欠落しています: ${field}`,
        });
        expect(() => createFormatQuizData(incompleteQuizData)).toThrow(error);
      },
    );
  });

  describe("createFormattedQuizList", () => {
    test("成功ケース:取得したクイズリストをcreateFormatQuizDataを使いフォーマットする", () => {
      const result = createFormattedQuizList(undecodedQuizList);
      expect(result).toEqual(decodedQuizList);
    });
    test("クイズデータが配列でない場合QuizErrorをスローする", () => {
      const error = new QuizError({
        code: QUIZ_ERROR_CODE.INVALID_DATA,
        message: "クイズリストが配列ではありません",
      });
      expect(() => createFormattedQuizList(undecodedQuizList[0])).toThrow(
        error,
      );
    });
  });

  describe("createQuizzes", () => {
    const category = "sports";
    const type = "multiple";
    const difficulty = "easy";
    const amount = 10;
    test("クイズデータを取得し,フォーマットされたクイズリストを返す", async () => {
      fetchQuizzes.mockResolvedValue(undecodedQuizList);
      const result = await createQuizzes(category, type, difficulty, amount);
      expect(result).toEqual(decodedQuizList);

      expect(fetchQuizzes).toHaveBeenCalledWith(
        category,
        type,
        difficulty,
        amount,
      );
    });

    test("失敗:クイズデータリストがなかった場合", async () => {
      fetchQuizzes.mockResolvedValue([]);
      const error = new QuizError({
        code: QUIZ_ERROR_CODE.NOT_FOUND,
        message: "該当するクイズが見つかりませんでした",
      });
      await expect(
        createQuizzes(category, type, difficulty, amount),
      ).rejects.toThrow(error);
    });

    test("fetch失敗時,NETWORKエラーとしてラップして再スローする", async () => {
      const originalError = new Error("API Server Down");
      fetchQuizzes.mockRejectedValue(originalError);

      try {
        await createQuizzes("sports", "multiple", "easy", 10);
      } catch (error) {
        expect(error).toBeInstanceOf(QuizError);
        expect(error.code).toBe(QUIZ_ERROR_CODE.NETWORK);
        expect(error.message).toBe(
          "ネットワークエラー クイズの取得に失敗しました",
        );
        expect(error.cause).toBe(originalError);
      }
    });
  });

  describe("validateQuizSettings:項目が選択されているかバリデーションを行う", () => {
    const validParams = {
      category: "sports",
      type: "multiple",
      difficulty: "easy",
      amount: 10,
    };

    test("正常系:すべての項目が正しく入力されている場合,trueを返す", () => {
      const resutl = validateQuizSettings(validParams);
      expect(resutl).toBe(true);
    });

    test.each([
      {
        params: { ...validParams, category: "" },
        field: "category",
        title: "category",
        message: "ジャンルを選択してください",
      },

      {
        params: { ...validParams, type: "" },
        field: "type",
        title: "type",
        message: "タイプを選択してください",
      },
      {
        params: { ...validParams, difficulty: "" },
        field: "difficulty",
        title: "difficulty",
        message: "レベルを選択してください",
      },
      {
        params: { ...validParams, amount: null },
        field: "amount",
        title: "amount",
        message: "問題数を選択してください",
      },
    ])(`$title`, ({ params, field, message }) => {
      expect(() => validateQuizSettings(params)).toThrow(
        new QuizError({
          code: QUIZ_ERROR_CODE.VALIDATION,
          message: message,
          field: field,
        }),
      );
    });
  });

  describe("judgeCorrectAnswer", () => {
    test("ユーザーの回答の正誤判定をする:正解の場合", () => {
      const quiz = decodedQuizList[0];
      const answer = quiz.correctAnswer;
      const result = judgeCorrectAnswer(quiz, answer);
      expect(result).toBe(true);
    });
    test("ユーザーの回答の正誤判定をする:失敗の場合", () => {
      const quiz = decodedQuizList[0];
      const answer = quiz.incorrectAnswers[0];
      const result = judgeCorrectAnswer(quiz, answer);
      expect(result).toBe(false);
    });

    test("クイズがない場合:falseを返す", () => {
      expect(judgeCorrectAnswer(null, "assss")).toBe(false);
    });
  });

  describe("shuffleAnswers", () => {
    test("回答の選択肢をシャッフルする", () => {
      const quiz = decodedQuizList[0];
      const result = shuffleAnswers(quiz);
      const allAnswers = [quiz.correctAnswer, ...quiz.incorrectAnswers];

      expect(result.length).toEqual(allAnswers.length);
      expect(result).toEqual(expect.arrayContaining(allAnswers));
      expect(result).toEqual(expect.arrayContaining(allAnswers));
      expect(allAnswers).toEqual(expect.arrayContaining(result));
    });

    test("失敗:クイズがない場合,incorrectAnswersが配列でない場合,から配列を返す", () => {
      expect(shuffleAnswers()).toEqual([]);
      const brokenQuizData = {
        difficulty: "easy",

        question:
          "In Star Wars, what's the name of the new Government created after the defeat of the Galactic Empire?",
        correctAnswer: "The New Republic",
        incorrectAnswers: "The Rebel Alliance",
      };

      expect(shuffleAnswers(brokenQuizData)).toEqual([]);
    });
  });

  describe("translateCurrentDifficulty", () => {
    test.each([
      ["easy", "かんたん"],
      ["medium", "ふつう"],
      ["hard", "むずかしい"],
    ])("%sの時%sを返す", (difficulty, expected) => {
      const quiz = { difficulty };
      expect(translateCurrentDifficulty(quiz)).toBe(expected);
    });

    test("失敗:難易度が不明の場合,不明と返す", () => {
      expect(translateCurrentDifficulty({ difficulty: "@@@" })).toBe("不明");
    });
  });
});
