//ResultButtonContainer.test.jsx

import { screen, render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import ResultButtonContainer from "@/components/widgets/QuizResult/ResultButtonContainer";

describe("ResultButtonContainer", () => {
  test("ボタンが表示され クリック時に対応する関数が呼ばれる", async () => {
    const mockOnRetry = vi.fn();
    const mockOnNavigate = vi.fn();
    const mockOnNavigateToHistory = vi.fn();
    const user = userEvent.setup();

    render(
      <ResultButtonContainer
        onNavigate={mockOnNavigate}
        onRetry={mockOnRetry}
        onNavigateToHistory={mockOnNavigateToHistory}
      />,
    );

    const retryButton = screen.getByRole("button", {
      name: "同じ条件でもう1度",
    });
    expect(retryButton).toBeInTheDocument();

    const backToHomeButton = screen.getByRole("button", {
      name: "ホームへ戻る",
    });
    expect(backToHomeButton).toBeInTheDocument();

    const goToHistoryButton = screen.getByRole("button", {
      name: "記録を見る",
    });
    expect(goToHistoryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);

    await user.click(backToHomeButton);
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    await user.click(goToHistoryButton);
    expect(mockOnNavigateToHistory).toHaveBeenCalledTimes(1);
  });
});
