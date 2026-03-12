// src/test/hooks/useNavigationHelper.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import { renderHookWithStore } from "../utils/renderHookWithStore";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";

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
import { act } from "@testing-library/react";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useNavigationHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      quizHistory: quizHistoryReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
    },
  };

  describe("handleGoHistory", () => {
    test("正常系:hisgtoryページに navigateされる", async () => {
      const { result } = renderHookWithStore({
        hook: () => useNavigationHelper(),
        ...commonOptions,
        initialPath: "/",
      });

      await act(async () => {
        await result.current.handleGoHistory();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/quiz/history");
    });

    test("クイズ中に確認ダイアログでキャンセルしたら何もしない", async () => {
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

      const { result } = renderHookWithStore({
        hook: () => useNavigationHelper(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,

          quizProgress: { ...progressInitialState, currentIndex: 0 },
          quizContent: {
            ...contentInitialState,
            quizzes: [{ question: "test" }],
          },
        },
        initialPath: "/quiz/play/sports",
      });

      await act(async () => {
        await result.current.handleGoHistory();
      });

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("handleGoHome", () => {
    test("正常系: クイズの設定とクイズ情報がリセットされ homeページにnavigateされ", async () => {
      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useNavigationHelper(),
        ...commonOptions,
        initialPath: "/quiz/play",
      });

      await act(async () => {
        await result.current.handleGoHome();
      });

      expect(mockNavigate).toHaveBeenCalledWith("/");
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "quizSettings/resetQuizSettings",
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "quizContent/resetQuizContent",
        }),
      );
    });

    test("クイズ中に確認ダイアログでキャンセルしたら何もしない", async () => {
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useNavigationHelper(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,

          quizProgress: { ...progressInitialState, currentIndex: 0 },
          quizContent: {
            ...contentInitialState,
            quizzes: [{ question: "test" }],
          },
        },
        initialPath: "/quiz/play/sports",
      });

      await act(async () => {
        await result.current.handleGoHome();
      });

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    describe("handleRetryFromHistory", () => {
      test("指定したIDの履歴と 同じ条件のクイズを設定し navigateする ", async () => {
        const { result, dispatchSpy } = renderHookWithStore({
          hook: () => useNavigationHelper(),

          reducers: { ...commonOptions.reducers },
          preloadedState: {
            ...commonOptions.preloadedState,
            quizHistory: {
              ...quizHistoryInitialState,
              histories: [
                {
                  id: 1,
                  category: "sports",
                  type: "boolean",
                  difficulty: "easy",
                  totalQuestions: 5,
                },
              ],
            },
          },
          initialPath: "quiz/history",
        });

        await act(async () => {
          await result.current.handleRetryFromHistory(1);
        });

        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "quizContent/resetQuizContent",
          }),
        );
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "quizSettings/setQuizSettings",
            payload: {
              category: "sports",
              type: "boolean",
              difficulty: "easy",
              amount: 5,
            },
          }),
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          "/quiz/play/sports?type=boolean&difficulty=easy&amount=5",
        );
      });

      test("異常系:存在しないIDを渡した場合 何も呼ばれない", async () => {
        const { result, dispatchSpy } = renderHookWithStore({
          hook: () => useNavigationHelper(),

          reducers: { ...commonOptions.reducers },
          preloadedState: {
            ...commonOptions.preloadedState,
            quizHistory: {
              ...quizHistoryInitialState,
              histories: [
                {
                  id: 1,
                  category: "sports",
                  type: "boolean",
                  difficulty: "easy",
                  totalQuestions: 5,
                },
              ],
            },
          },
          initialPath: "quiz/history",
        });

        await act(async () => {
          await result.current.handleRetryFromHistory(99);
        });

        expect(dispatchSpy).not.toHaveBeenCalled();

        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
});
