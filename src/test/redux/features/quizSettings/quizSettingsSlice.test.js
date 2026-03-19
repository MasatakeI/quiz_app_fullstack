//quizSettingsSlice.test.js

import { describe, test, expect } from "vitest";

import quizSettingsReducer, {
  settingsInitialState,
  setQuizSettings,
  resetQuizSettings,
  updateSettings,
  setSettingsError,
} from "@/redux/features/quizSettings/quizSettingsSlice";

describe("quizSettingsSlice.jsのテスト", () => {
  test("初期stateの確認", () => {
    expect(settingsInitialState).toEqual({
      category: "sports",
      type: "multiple",
      difficulty: "easy",
      amount: "10",
      settingError: { message: "", field: "" },
    });
  });

  describe("reducers", () => {
    describe("setQuizSetttings", () => {
      test("クイズ条件を設定する", () => {
        const action = setQuizSettings({
          ...settingsInitialState,

          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        });

        const state = quizSettingsReducer(settingsInitialState, action);

        expect(state).toEqual({
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
          settingError: { message: "", field: "" },
        });
      });
    });

    describe("resetQuizSettings", () => {
      test("stateを初期状態に戻す", () => {
        const prev = {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        };

        const action = resetQuizSettings();
        const state = quizSettingsReducer(prev, action);
        expect(state).toEqual(settingsInitialState);
      });
    });

    describe("updateSettings", () => {
      test.each([
        ["category", "music"],
        ["type", "boolean"],
        ["difficulty", "medium"],
        ["amount", 20],
      ])("%sを%sに変更", (key, value) => {
        const prev = {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        };

        const action = updateSettings({ key, value });
        const state = quizSettingsReducer(prev, action);
        expect(state[key]).toEqual(value);
      });

      test("エラーが出ているフィールドの値を更新したとき,エラーが初期化される", () => {
        const prev = {
          ...settingsInitialState,
          difficulty: "",
          settingError: {
            message: "レベルを選択してください",
            field: "difficulty",
          },
        };

        const action = updateSettings({ key: "difficulty", value: "hard" });
        const state = quizSettingsReducer(prev, action);

        expect(state).toEqual({
          ...prev,
          difficulty: "hard",
          settingError: { message: "", field: "" },
        });
      });
    });

    describe("setSettingsError", () => {
      test("エラーメッセージとそのフィールドを設定する", () => {
        const prev = {
          category: "sports",
          type: "multiple",
          difficulty: "",
          amount: 10,
          settingError: {
            message: "",
            field: "",
          },
        };

        const errorPayload = {
          message: "レベルを選択してください",
          field: "difficulty",
        };

        const action = setSettingsError(errorPayload);
        const state = quizSettingsReducer(prev, action);

        expect(state).toEqual({
          ...prev,
          settingError: {
            message: "レベルを選択してください",
            field: "difficulty",
          },
        });
      });
    });
  });
});
