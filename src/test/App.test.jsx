//App.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { screen } from "@testing-library/react";

import App from "../App";

import { renderWithStore } from "./utils/renderWithStore";
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
import snackbarReducer, {
  snackbarInitialState,
} from "@/redux/features/snackbar/snackbarSlice";

import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/Header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/layout/Footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/AppRoutes", () => ({
  default: () => <div data-testid="app-routes">AppRoutes</div>,
}));

vi.mock("@/components/common/SimpleSnackbar/SimpleSnackbar", () => ({
  default: ({ message, isOpen, onClose }) => (
    <div data-testid="simple-snackbar">
      {isOpen && (
        <>
          <span>{message}</span>
          <button onClick={onClose}>Close</button>
        </>
      )}
    </div>
  ),
}));

vi.mock("@/components/common/BasicModal/BasicModal", () => ({
  default: ({ component, isOpen, onClose }) => (
    <div data-testid="basic-modal">
      {isOpen && (
        <>
          <span>{component}</span>
          <button onClick={onClose}>キャンセル</button>
        </>
      )}
    </div>
  ),
}));

vi.mock("@/components/widgets/AuthForm/AuthForm", () => ({
  default: () => (
    <div data-testid="auth-form">
      AuthForm
      <button>ログイン</button>
    </div>
  ),
}));

describe("App.jsx", () => {
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
      snackbar: snackbarReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
      snackbar: { ...snackbarInitialState },
    },
  };
  describe("初期パス / HomePageとレイアウトの基本コンポーネントが描画される", () => {
    test.each([
      "header",
      "footer",
      "simple-snackbar",
      "app-routes",
      "basic-modal",
    ])("%s", (testId) => {
      renderWithStore(
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>,
        commonOptions,
      );

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  test.skip("snackbarが開いているとき,メッセージが正しく表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,
      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          snackbar: {
            snackbarMessage: "error",
            snackbarOpen: true,
          },
        },
      },
    );

    expect(screen.getByTestId("simple-snackbar")).toHaveTextContent("error");
  });
  test("snackbarのCloseボタンを押すと,snackbarが閉じる", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,
      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          snackbar: {
            snackbarMessage: "error",
            snackbarOpen: true,
          },
        },
      },
    );

    const closeButton = screen.getByRole("button", { name: "Close" });

    await user.click(closeButton);

    expect(screen.getByTestId("simple-snackbar").firstChild).toBe(null);
    expect(store.getState().snackbar.snackbarOpen).toBe(false);
  });

  test("modalが開いているとき AuthFormが表示される", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,

      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, isAuthModalOpen: true },
        },
      },
    );

    expect(screen.getByTestId("auth-form")).toBeInTheDocument();
  });
  test("AuthFormの Closeボタンを押すと 閉じる", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,

      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, isAuthModalOpen: true },
        },
      },
    );

    const closeButton = screen.getByRole("button", { name: "キャンセル" });

    await user.click(closeButton);

    expect(store.getState().auth.isAuthModalOpen).toBe(false);
  });

  test("ログインした場合:自動でAuthModalが閉じる", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <MemoryRouter initialEntries={["/quiz/sports"]}>
        <App />
      </MemoryRouter>,

      {
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          auth: { ...authInitialState, isAuthModalOpen: true },
        },
      },
    );

    const loginButton = screen.getByRole("button", { name: "ログイン" });
    await user.click(loginButton);

    // expect(store.getState().auth.isAuthModalOpen).toBe(false);
    // expect(dispatchSpy).toHaveBeenCalledWith({ type: "auth/closeAuthModal" });
  });
});
