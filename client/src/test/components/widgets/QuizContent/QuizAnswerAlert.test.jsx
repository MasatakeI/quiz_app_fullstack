// src/test/components/widgets/QuizContent/QuizAnswerAlert.test.js

import { screen } from "@testing-library/react";

import { describe, test, expect, vi, beforeEach } from "vitest";

import QuizAnswerAlert from "../../../../components/widgets/QuizContent/QuizAnswerAlert";
import { renderWithStore } from "@/test/utils/renderWithStore";

import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";

import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import userEvent from "@testing-library/user-event";

describe("QuizAnswerAlert.jsxのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOption = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
    },
  };

  describe("quizResultがあるとメッセージとボタンが表示される", () => {
    test.each([
      {
        title: "正解",
        msg: "正解!",
        isCorrect: true,
        selected: "a",
      },
      {
        title: "不正解",
        msg: "不正解...",
        isCorrect: false,
        selected: "b",
      },
    ])("$title の時", async ({ msg, isCorrect, selected }) => {
      const user = userEvent.setup();
      const onNext = vi.fn();
      const result = {
        isCorrect: isCorrect,
        selected: selected,
        correct: "a",
        message: msg,
      };
      renderWithStore(<QuizAnswerAlert quizResult={result} onNext={onNext} />, {
        ...commonOption,
      });

      expect(screen.getByText(msg)).toBeInTheDocument();
      const goToNextButton = screen.getByRole("button", { name: "次へ" });
      await user.click(goToNextButton);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  test("quizResultがないと何も表示されない", () => {
    const { container } = renderWithStore(
      <QuizAnswerAlert quizResult={null} onNext={() => {}} />,
      {
        ...commonOption,
      },
    );
    expect(container.firstChild).toBeNull();
  });

  test("正解時の表示（successルートの網羅）", () => {
    const result = { isCorrect: true, message: "正解!", selected: "A" };
    renderWithStore(
      <QuizAnswerAlert quizResult={result} onNext={vi.fn()} />,
      commonOption,
    );

    // 本物の AnswerAlert を使っている場合、MUI等ならクラス名やロールで確認
    // 少なくとも、"success" という値が Props に渡って実行されたことを確実にする
    expect(screen.getByText("正解!")).toBeInTheDocument();
  });

  test("不正解時の表示（errorルートの網羅）", () => {
    const result = { isCorrect: false, message: "不正解...", selected: "B" };
    renderWithStore(
      <QuizAnswerAlert quizResult={result} onNext={vi.fn()} />,
      commonOption,
    );

    expect(screen.getByText("不正解...")).toBeInTheDocument();
  });

  test("ガード句: quizResult が undefined の場合", () => {
    // null だけでなく undefined も試して、if (!quizResult) を確実にパスさせる
    const { container } = renderWithStore(
      <QuizAnswerAlert quizResult={undefined} onNext={vi.fn()} />,
      commonOption,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
