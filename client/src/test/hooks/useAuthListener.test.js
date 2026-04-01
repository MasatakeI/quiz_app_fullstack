import { describe, test, expect, vi, beforeEach } from "vitest";
import { onAuthStateChanged } from "firebase/auth";
import { renderHookWithStore } from "../utils/renderHookWithStore";
import { useAuthListener } from "@/hooks/useAuthListener";

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
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";
import { act } from "@testing-library/react";

// Firebaseのモック
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("@/firebase", () => ({
  auth: {},
}));

describe("useAuthListener", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      quizHistory: quizHistoryReducer,
      auth: authReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  test("Firebaseでログインが検知された時、setUserがdispatchされる", () => {
    const mockUser = { uid: "user123", email: "test@example.com" };

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {};
    });

    const { store } = renderHookWithStore({
      hook: () => useAuthListener(),
      ...commonOptions,
    });

    expect(store.getState().auth.user).toEqual(mockUser);
  });

  test("Firebaseでログアウトが検知された時、clearUserがdispatchされる", () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    const { store } = renderHookWithStore({
      hook: () => useAuthListener(),
      ...commonOptions, // オプションを渡す
      preloadedState: {
        ...commonOptions.preloadedState,
        auth: { user: { uid: "old" }, isAuthModalOpen: false },
      },
    });

    expect(store.getState().auth.user).toBeNull();
  });

  test("Reduxのuser状態がセットされた時、自動的にisAuthModalOpenがfalseになる", async () => {
    let triggerAuthChange; // コールバックを保持する変数

    onAuthStateChanged.mockImplementation((auth, callback) => {
      triggerAuthChange = callback;
      callback(null);
      return () => {};
    });

    const { store } = renderHookWithStore({
      hook: () => useAuthListener(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        auth: { user: null, isAuthModalOpen: true },
      },
    });

    // モーダルが開いていることを確認
    expect(store.getState().auth.isAuthModalOpen).toBe(true);

    // ユーザーがログインした状態にモックを差し替えて再実行
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: "new-user" });
      return () => {};
    });

    await act(() => {
      triggerAuthChange({ uid: "aaa", email: "aaa@bbb.com" });
    });

    expect(store.getState().auth.isAuthModalOpen).toBe(false);
  });
});
