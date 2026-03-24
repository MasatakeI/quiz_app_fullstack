import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import QuizHistoryItem from "@/components/widgets/QuizHistory/QuizHistoryItem";
import { QUIZ_TITLE_MAP } from "@/constants/quizCategories";
import { DIFFICULTY_LABELS, TYPE_LABELS } from "@/constants/quizTranslations";

describe("QuizHistoryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onDelete = vi.fn();
  const onRetry = vi.fn();
  const onSelect = vi.fn();

  test("Propsが未定義の場合、デフォルト値が適用されて正しく描画される（カバレッジ補完）", () => {
    render(
      <QuizHistoryItem
        historyCategory={"general"}
        historyDifficulty={"easy"}
        historyType={"multiple"}
        onDelete={onDelete}
        onSelect={onSelect}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText(QUIZ_TITLE_MAP["general"])).toBeInTheDocument();
    expect(screen.getByText(DIFFICULTY_LABELS["easy"])).toBeInTheDocument();
    expect(screen.getByText(TYPE_LABELS["multiple"])).toBeInTheDocument();
  });

  test("isSelectedがtrueの時 チェックボックスがチェックされる", async () => {
    render(
      <QuizHistoryItem historyCategory={"general"} id={1} isSelected={true} />,
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  test("チェックボックスをクリックした時 正しいidでonSelectが呼ばれる", async () => {
    const user = userEvent.setup();

    render(
      <QuizHistoryItem
        historyCategory={"general"}
        id={1}
        isSelected={true}
        onSelect={onSelect}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  test("必要なデータが描画され 削除ボタンを押したとき 対応する関数が呼ばれる", async () => {
    const user = userEvent.setup();

    const resultData = {
      date: "2020/01/01 12:00",
      category: "sports",
      score: 4,
      totalQuestions: 10,
      accuracy: 0.4,
      difficulty: "easy",
      type: "multiple",
    };

    render(
      <QuizHistoryItem
        historyDate={resultData.date}
        historyCategory={resultData.category}
        historyScore={resultData.score}
        historyTotalQuestions={resultData.totalQuestions}
        historyAccuracy={resultData.accuracy}
        historyDifficulty={resultData.difficulty}
        historyType={resultData.type}
        onDelete={onDelete}
        onRetry={onRetry}
        id={1}
        isSelected={false}
      />,
    );

    expect(screen.getByText(/2020\/01\/01/)).toBeInTheDocument();
    expect(
      screen.getByText(QUIZ_TITLE_MAP[resultData.category]),
    ).toBeInTheDocument();
    expect(screen.getByText(`${resultData.score}`)).toBeInTheDocument();
    expect(
      screen.getByText(DIFFICULTY_LABELS[resultData.difficulty]),
    ).toBeInTheDocument();
    expect(screen.getByText(TYPE_LABELS[resultData.type])).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "削除" });
    const retryButton = screen.getByRole("button", {
      name: "同じ条件で再挑戦",
    });

    await user.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test.each([
    { accuracy: 0.33333, expected: "33%" },
    { accuracy: 0.5555, expected: "56%" },
    { accuracy: 0, expected: "0%" },
    { accuracy: 1, expected: "100%" },
  ])(
    "正解率 $accuracy が $expected に変換されること",
    ({ accuracy, expected }) => {
      render(
        <QuizHistoryItem
          historyAccuracy={accuracy}
          historyCategory="sports" // ダミーの有効なキーを渡す
          historyType="multiple"
          historyDifficulty="easy"
        />,
      );
      expect(screen.getByText(expected)).toBeInTheDocument();
    },
  );
});
