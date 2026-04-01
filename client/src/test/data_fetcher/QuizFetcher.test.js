//QuizFetcher.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import axios from "axios";
vi.mock("axios");

import { undecodedQuizList } from "../fixtures/quizFixture";

import { API_URL, fetchQuizzes } from "../../data_fetcher/QuizFetcher";
import { CATEGORY_MAP } from "../../constants/quizCategories";

describe("QuizFetcher.jsのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const type = "multiple";
  const difficulty = "easy";
  const amount = 10;

  describe("fetchQuizzes", () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({
        data: { results: undecodedQuizList },
      });
    });
    describe("成功ケース", () => {
      describe.each(Object.entries(CATEGORY_MAP))(
        "category=%s",
        (category, categoryId) => {
          test(`${category}の時`, async () => {
            const result = await fetchQuizzes(
              category,
              type,
              difficulty,
              amount
            );
            const params = {
              category: categoryId,
              type,
              difficulty,
              amount,
            };
            expect(axios.get).toHaveBeenCalledWith(API_URL, { params });
            expect(axios.get).toHaveBeenCalledTimes(1);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toEqual(undecodedQuizList.length);
          });
        }
      );
    });

    describe("失敗ケース", () => {
      test("無効なカテゴリーの時:エラーをスローする", async () => {
        const invalidCategory = "@@@";
        await expect(
          fetchQuizzes(invalidCategory, type, difficulty, amount)
        ).rejects.toThrow("無効なカテゴリーです");

        expect(axios.get).not.toHaveBeenCalled();
      });

      test("通信失敗時:エラーをスローする", async () => {
        axios.get.mockRejectedValue(new Error("network error"));
        const errorMessage = "fetch失敗(QuizFetcher)";
        const category = "sports";
        await expect(
          fetchQuizzes(category, type, difficulty, amount)
        ).rejects.toThrow(errorMessage);
      });
    });
  });
});
