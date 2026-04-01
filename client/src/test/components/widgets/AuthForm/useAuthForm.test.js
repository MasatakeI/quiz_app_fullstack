//useAuthForm.test.jsx

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

import { useAuthForm } from "@/components/widgets/AuthForm/useAuthForm";

import * as authThunks from "@/redux/features/auth/authThunks";

import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

describe("useAuthForm", () => {
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

  describe("正常系共通処理", async () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUpUser",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signInUser",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      const spy = vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.resolve(),
      });
      const mockEvent = { preventDefault: vi.fn() };

      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
      });

      act(() => {
        result.current[stateKey].setEmail("aaa@bbb.com");
        result.current[stateKey].setPassword("xxxzzz");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit(mockEvent);
      });

      expect(result.current.signUpState.email).toBe("");
      expect(result.current.signUpState.password).toBe("");
      expect(spy).toHaveBeenCalledWith({
        email: "aaa@bbb.com",
        password: "xxxzzz",
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe("バリデーション共通処理:isLoading=trueの時 dispatchされず ボタンも連打できない", () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUpUser",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signInUser",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      const mockEvent = { preventDefault: vi.fn() };

      const spy = vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.resolve({}),
      });

      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, isLoading: true },
        },
      });

      act(() => {
        result.current[stateKey].setEmail("aaa@bbb.com");
        result.current[stateKey].setPassword("xxxzzz");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit(mockEvent);
      });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("異常系共通処理:stateは更新されない", () => {
    test.each([
      {
        title: "handleSignUp",
        thunk: "signUpUserAsync",
        stateKey: "signUpState",
        typeKey: "auth/signUpUser",
      },
      {
        title: "handleSignIn",
        thunk: "signInUserAsync",
        stateKey: "signInState",
        typeKey: "auth/signInUser",
      },
    ])("$title", async ({ thunk, stateKey, typeKey }) => {
      const mockEvent = { preventDefault: vi.fn() };

      const spy = vi.spyOn(authThunks, thunk).mockReturnValue({
        type: typeKey,
        unwrap: () => Promise.reject(new Error("エラー")),
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHookWithStore({
        hook: () => useAuthForm(),
        ...commonOptions,
      });

      act(() => {
        result.current[stateKey].setEmail("aaa@bbb.com");
        result.current[stateKey].setPassword("xxxzzz");
      });

      await act(async () => {
        await result.current[stateKey].onSubmit(mockEvent);
      });

      expect(result.current[stateKey].email).toBe("aaa@bbb.com");
      expect(result.current[stateKey].password).toBe("xxxzzz");
      expect(spy).toHaveBeenCalledWith({
        email: "aaa@bbb.com",
        password: "xxxzzz",
      });
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
