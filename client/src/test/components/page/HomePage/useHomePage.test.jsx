//useHomePage.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";

import { useHomePage } from "@/components/page/HomePage/useHomePage";

import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useHomePage.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      snackbar: snackbarReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
    },
  };
  describe("handleStart", () => {
    test("成功時:dispatchとnavigateが呼ばれる", async () => {
      const { store, result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizSettings: {
            category: "music",
            type: "multiple",
            difficulty: "hard",
            amount: 10,
          },
        },
      });

      act(() => {
        result.current.handleStart();
      });

      const state = store.getState().quizSettings;

      expect(state.category).toBe("music");
      expect(state.difficulty).toBe("hard");
      expect(state.type).toBe("multiple");
      expect(state.amount).toBe(10);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/quiz/play/music?type=multiple&difficulty=hard&amount=10",
      );
    });

    test("type=booleanの時 amountは5に強制される", () => {
      const { result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizSettings: {
            category: "music",
            type: "boolean",
            difficulty: "hard",
            amount: 10,
          },
        },
      });

      act(() => {
        result.current.handleStart();
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        "/quiz/play/music?type=boolean&difficulty=hard&amount=5",
      );
    });

    test("異常系:失敗時messageとfieldが設定され,messageがsnackbarで表示される", () => {
      const { store, result, dispatchSpy } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizSettings: {
            category: "music",
            type: "boolean",
            difficulty: "",
            amount: 10,
          },
        },
      });

      act(() => {
        result.current.handleStart();
      });

      const state = store.getState();

      expect(state.quizSettings.settingError.field).toBe("difficulty");
      expect(state.quizSettings.settingError.message).toBe(
        "レベルを選択してください",
      );

      expect(mockNavigate).not.toHaveBeenCalled();

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: "snackbar/showSnackbar",
        payload: "レベルを選択してください",
      });
    });
  });

  describe("items", () => {
    test("4つ定義されている", () => {
      const { result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
      });

      expect(result.current.items).toHaveLength(4);
    });

    test("type=booleanの時,amountが5になりフィールドがdisabled", () => {
      const { store, result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizSettings: {
            ...settingsInitialState,
            type: "boolean",
          },
        },
      });

      const typeItem = result.current.items.find((i) => i.label === "タイプ");

      const amountItem = result.current.items.find((i) => i.label === "問題数");

      expect(amountItem.disabled).toBe(true);
      act(() => {
        typeItem.onChange("boolean");
      });

      const state = store.getState().quizSettings;

      expect(state.type).toBe("boolean");
      expect(state.amount).toBe(5);
    });

    test("category / difficylty / amount のonChangeが stateを更新する", () => {
      const { store, result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
      });

      const find = (label) =>
        result.current.items.find((i) => i.label === label);

      act(() => find("ジャンル").onChange("sports"));
      act(() => find("レベル").onChange("easy"));
      act(() => find("問題数").onChange("20"));

      const state = store.getState().quizSettings;

      expect(state.category).toBe("sports");
      expect(state.difficulty).toBe("easy");
      expect(state.amount).toBe("20");
    });

    test.each(["category", "type", "difficulty", "amount"])(
      "settingError.field= %s のitemに errorがつく",
      (field) => {
        const { result } = renderHookWithStore({
          hook: () => useHomePage(),
          ...commonOptions,
          preloadedState: {
            ...commonOptions.preloadedState,
            quizSettings: {
              ...settingsInitialState,
              settingError: { field, message: "error" },
            },
          },
        });

        const item = result.current.items.find((i) => i.key === field);

        expect(item.error).toBe(true);
      },
    );

    test("state変更で itemsが更新される", () => {
      const { result } = renderHookWithStore({
        hook: () => useHomePage(),
        ...commonOptions,
      });

      const before = result.current.items;

      act(() => {
        result.current.items[0].onChange("music");
      });

      const after = result.current.items;

      expect(after).not.toBe(before);
    });
  });
});
