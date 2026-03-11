import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import QuizHistoryItem from "@/components/widgets/QuizHistory/QuizHistoryItem";

describe("QuizHistoryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("必要なデータが描画され 削除ボタンを押したとき 対応する関数が呼ばれる", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    const resultData = {
      date: "2020/01/01 ",
      category: "sports",
      score: 4,
      totalQuestions: 10,
      accuracy: 0.4,
      difficulty: "easy",
    };

    render(
      <QuizHistoryItem
        historyDate={resultData.date}
        historyCategory={resultData.category}
        historyScore={resultData.score}
        historyTotalQuesitions={resultData.totalQuestions}
        historyAccuracy={resultData.accuracy}
        historyDifficulty={resultData.difficulty}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText(/2020\/01\/01/)).toBeInTheDocument();
    expect(screen.getByText(resultData.category)).toBeInTheDocument();
    expect(screen.getByText("4/10")).toBeInTheDocument();
    expect(
      screen.getByText(`${resultData.score}/${resultData.totalQuestions}`),
    ).toBeInTheDocument();
    expect(screen.getByText(resultData.difficulty)).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "削除" });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("Accuracy が正しく四捨五入される", async () => {
    const resultData = {
      score: 3,
      totalQuestions: 10,
      accuracy: 0.33333,
    };

    render(
      <QuizHistoryItem
        historyScore={resultData.score}
        historyTotalQuesitions={resultData.totalQuestions}
        historyAccuracy={resultData.accuracy}
      />,
    );

    expect(screen.getByText(`33%`)).toBeInTheDocument();

    //境界値のテスト
    render(<QuizHistoryItem historyAccuracy={0.5555} />);
    expect(screen.getByText(`56%`)).toBeInTheDocument();
  });
});
