// src/test/components/widgets/QuizContent/QuizAnswers.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import QuizAnswers from "../../../../components/widgets/QuizContent/QuizAnswers";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "@/test/utils/renderWithStore";

import { contentInitialState } from "@/redux/features/quizContent/quizContentSlice";
import { progressInitialState } from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "@/redux/features/quizContent/quizContentSlice";
import quizProgressReducer from "@/redux/features/quizProgress/quizProgressSlice";

describe("QuizAnswer.jsxのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState: {
      quizContent: {
        ...contentInitialState,
        quizzes: [
          {
            question: "test1?",
            correctAnswer: "a",
            incorrectAnswers: ["b", "c", "d"],
            difficulty: "easy",
          },
        ],
      },
      quizProgress: { ...progressInitialState },
    },
  };

  const baseProps = {
    shuffledAnswers: ["a", "b", "c", "d"],
    onSelect: vi.fn(),
    canPost: true,
    indexMap: ["A", "B", "C", "D"],
    selectedAnswer: null,
    correctAnswer: "a",
  };

  test("answers分のボタンが表示される", async () => {
    renderWithStore(<QuizAnswers {...baseProps} />, commonOptions);
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  test("選択肢クリックでonSelectが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithStore(
      <QuizAnswers {...baseProps} onSelect={onSelect} />,
      commonOptions,
    );

    const answerButton = screen.getByRole("button", { name: "A. a" });
    await user.click(answerButton);

    expect(onSelect).toHaveBeenCalledWith("a");
  });

  describe("回答結果によってButtonにカラーステータスを付与する", () => {
    test.each([
      {
        title: "正解",
        indexMap: "A",
        answer: "a",
        status: "correct",
      },
      {
        title: "不正解",
        indexMap: "B",
        answer: "b",
        status: "incorrect",
      },
    ])(
      "$title の時 $status が付与される",
      async ({ answer, indexMap, status }) => {
        renderWithStore(
          <QuizAnswers
            {...baseProps}
            canPost={false}
            selectedAnswer={answer}
            correctAnswer={"a"}
          />,
          commonOptions,
        );

        const answeredButton = screen.getByRole("button", {
          name: `${indexMap}. ${answer}`,
        });

        if (status === "correct") {
          expect(answeredButton).toHaveClass(` button-status-correct`);
        } else {
          expect(answeredButton).toHaveClass(`button-status-incorrect`);
        }
      },
    );
  });

  test("canPost=trueの時はstatusが付かない", async () => {
    const onSelect = vi.fn();
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        onSelect={onSelect}
        canPost={true}
        selectedAnswer={"a"}
        correctAnswer={"a"}
      />,
      commonOptions,
    );

    const answeredButtons = screen.getAllByRole("button");

    answeredButtons.forEach((btn) => {
      expect(btn.className).not.toMatch(/correct|incorrect|success|error/);
    });
  });

  test("正解でも選択回答でもないボタンにはステータスが付かない", async () => {
    const onSelect = vi.fn();
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        onSelect={onSelect}
        canPost={false}
        selectedAnswer={"d"}
        correctAnswer={"a"}
      />,
      commonOptions,
    );

    const otherButton = screen.getByRole("button", { name: "C. c" });
    expect(otherButton.className).not.toMatch(/button-status-/);
  });

  test("selectedAnswer=nullの時 correctのみ statusがつく", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        canPost={false}
        selectedAnswer={null}
        correctAnswer={"a"}
      />,
      commonOptions,
    );

    const correctBtn = screen.getByRole("button", { name: "A. a" });
    expect(correctBtn).toHaveClass("button-status-correct");

    const otherBtn = screen.getByRole("button", { name: "B. b" });
    expect(otherBtn.className).not.toMatch(/button-status-/);
  });

  test("correct と incorrect が同時に存在する", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        canPost={false}
        selectedAnswer={"b"}
        correctAnswer={"a"}
      />,
      commonOptions,
    );

    expect(screen.getByRole("button", { name: "A. a" })).toHaveClass(
      "button-status-correct",
    );

    expect(screen.getByRole("button", { name: "B. b" })).toHaveClass(
      "button-status-incorrect",
    );
  });

  test("clickbalse=falseかつstatusなしの場合 disabledになる", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        canPost={false}
        selectedAnswer={null}
        correctAnswer={null}
      />,
      commonOptions,
    );

    expect(screen.getByRole("button", { name: "A. a" })).toBeDisabled();
  });

  test("shuffledAnswersが空の場合", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        shuffledAnswers={[]}
        canPost={false}
        selectedAnswer={null}
        correctAnswer={null}
      />,
      commonOptions,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  test("正解 不正解 無関係 の3種類が混在する状態で一括検証", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        canPost={false}
        selectedAnswer={"b"}
        correctAnswer={"a"}
      />,
      commonOptions,
    );

    const buttons = screen.getAllByRole("button");
    const getStatus = (btn) => btn.className;

    expect(getStatus(buttons[0])).toMatch(/button-status-correct/);
    expect(getStatus(buttons[1])).toMatch(/button-status-incorrect/);
    expect(getStatus(buttons[2])).not.toMatch(/button-status-/);
    expect(getStatus(buttons[3])).not.toMatch(/button-status-/);
  });

  test("map全体: correct / incorrect / null が混在し、nullのまま渡されるButtonが存在する", () => {
    renderWithStore(
      <QuizAnswers
        {...baseProps}
        canPost={false}
        selectedAnswer={"b"} // 不正解を選択
        correctAnswer={"a"} // 正解
      />,
      commonOptions,
    );

    const buttons = screen.getAllByRole("button");

    // A. a → correct
    expect(buttons[0]).toHaveClass("button-status-correct");

    // B. b → incorrect（自分の選択）
    expect(buttons[1]).toHaveClass("button-status-incorrect");

    // C. c → null（どの条件にも該当しない）
    expect(buttons[2].className).not.toMatch(/button-status-/);

    // D. d → null（どの条件にも該当しない）
    expect(buttons[3].className).not.toMatch(/button-status-/);
  });

  test("disabled状態ではクリックしてもonSelectは呼ばれない", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithStore(
      <QuizAnswers
        {...baseProps}
        onSelect={onSelect}
        canPost={false}
        selectedAnswer={null}
        correctAnswer={null} // status = null → disabled
      />,
      commonOptions,
    );

    const btn = screen.getByRole("button", { name: "A. a" });

    expect(btn).toBeDisabled(); // 保険

    await user.click(btn);

    expect(onSelect).not.toHaveBeenCalled();
  });
});
