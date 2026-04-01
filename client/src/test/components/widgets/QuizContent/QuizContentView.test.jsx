// src/test/components/widgets/QuizContent/QuizContentView.test.js

import { screen, render } from "@testing-library/react";

import { describe, test, expect, vi } from "vitest";

import QuizContentView from "@/components/widgets/QuizContent/QuizContentView";

describe("QuizContentView.jsx", () => {
  const defaultProps = {
    title: "スポーツ",
    getType: "4択",
    amount: 10,
    currentDifficulty: "かんたん",
    type: "multiple",
    currentQuiz: { question: "test?" },
    currentIndex: 3,
    numberOfCorrects: 2,
    numberOfIncorrects: 1,
  };
  test("currentQuizがある場合:クイズが表示される", () => {
    render(<QuizContentView {...defaultProps} />);

    expect(screen.getByText("スポーツクイズ")).toBeInTheDocument();
    expect(screen.getByText("問題数 10")).toBeInTheDocument();
    expect(screen.getByText("Level かんたん")).toBeInTheDocument();
    expect(screen.getByText("タイプ 4択")).toBeInTheDocument();
    expect(screen.getByText("Q4. test?")).toBeInTheDocument();

    expect(screen.getByText(/正解数/)).toHaveTextContent("2");
    expect(screen.getByText(/誤答数/)).toHaveTextContent("1");
  });

  test("currentQuizがない場合", () => {
    const { container } = render(<QuizContentView currentQuiz={null} />);

    expect(container.firstChild).toBe(null);
  });
});
