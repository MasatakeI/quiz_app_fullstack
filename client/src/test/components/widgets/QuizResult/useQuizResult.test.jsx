//useQuizResult.test.jsx

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act } from "@testing-library/react";

import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";

import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";

import snackbarReducer, {
  snackbarInitialState,
} from "@/redux/features/snackbar/snackbarSlice";
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";

import { useQuizResult } from "@/components/widgets/QuizResult/useQuizResult";

import * as quizContentThunks from "@/redux/features/quizContent/quizContentThunks";

import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ category: "sports" }),
  };
});

describe("useQuizResult", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      quizHistory: quizHistoryReducer,
      snackbar: snackbarReducer,
      auth: authReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      snackbar: { ...snackbarInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  describe("Mapping logic", () => {
    test("URLパラメータの値を正しく日本語に変換する", () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,
        initialPath: "/quiz/sports?type=boolean&difficulty=hard&amount=5",
      });

      expect(result.current.getType).toBe("2択");
    });
  });

  describe("Edge case(欠落・不正な値)", () => {
    test("URLパラメータが全くない場合,各値がnullまたはundefinedになる", () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,

        initialPath: "/quiz/sports",
      });

      expect(result.current.amount).toBeNull();
      // expect(result.current.type).toBeNull();
      expect(result.current.type).toBeUndefined();
      expect(result.current.getType).toBe("不明");
      expect(result.current.quizTitle).toEqual("スポーツ");
    });
  });

  describe("handleRetry", () => {
    test("fetchQuizzesAsyncがdispatchされる", async () => {
      const fetchSpy = vi.spyOn(quizContentThunks, "fetchQuizzesAsync");

      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,
        initialPath: "/quiz/sports?difficulty=easy&type=multiple&amount=10",
      });

      await act(async () => {
        await result.current.handleRetry();
      });

      expect(fetchSpy).toHaveBeenCalledWith({
        category: "sports",
        type: "multiple",
        difficulty: "easy",
        amount: "10",
      });
    });
  });

  describe("handleGoHome", () => {
    test("ホームページへ戻る", () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,
      });

      act(() => {
        result.current.handleGoHome();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("selector", () => {
    test("値がそのまま返る", () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizProgress: {
            ...commonOptions.preloadedState.quizProgress,
            numberOfCorrects: 1,
            numberOfIncorrects: 1,
            userAnswers: [
              {
                question: "a",
              },
              {
                question: "b",
              },
            ],
          },
        },
      });

      expect(result.current.numberOfCorrects).toBe(1);
      expect(result.current.numberOfIncorrects).toBe(1);
      expect(result.current.userAnswers.length).toBe(2);
    });
  });

  describe("quizTitles", () => {
    test("categoryからタイトルが生成される", () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizResult(),
        ...commonOptions,
      });

      expect(result.current.quizTitle).toBe("スポーツ");
    });
  });
});
