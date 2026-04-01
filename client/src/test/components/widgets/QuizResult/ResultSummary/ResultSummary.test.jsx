// test/src/components/widgets/QuizResult/ResultSummary/ResultSummary.jsx

import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import ResultSummary from "../../../../../components/widgets/QuizResult/ResultSummary/ResultSummary";

describe("ResultSummary", () => {
  const mockCorrectUserAnswers = [
    {
      question: "a",
      correctAnswer: "b",
      selectedAnswer: "b",
      allAnswers: ["b", "c", "d", "e"],
      isCorrect: true,
    },
  ];
  const mockSelectedUserAnswers = [
    {
      question: "a",
      correctAnswer: "b",
      selectedAnswer: "c",
      allAnswers: ["b", "c", "d", "e"],
      isCorrect: false,
    },
  ];

  test("問題文が表示される", () => {
    render(
      <ResultSummary
        userAnswers={mockCorrectUserAnswers}
        indexMap={["A", "B", "C", "D"]}
      />
    );

    expect(screen.getByText("Q1. a")).toBeInTheDocument();
  });

  test("正解の選択肢にcorrectクラスと◯がつく", () => {
    render(
      <ResultSummary
        userAnswers={mockCorrectUserAnswers}
        indexMap={["A", "B", "C", "D"]}
      />
    );

    const correctAnswer = screen.getByText(/b/);
    expect(correctAnswer).toHaveClass("correct");
    expect(correctAnswer).toHaveTextContent("◯");
  });

  test("誤答の選択肢にselectedクラスと×がつく", () => {
    render(
      <ResultSummary
        userAnswers={mockSelectedUserAnswers}
        indexMap={["A", "B", "C", "D"]}
      />
    );

    const selectedAnswer = screen.getByText(/c/);
    expect(selectedAnswer).toHaveClass("selected");
    expect(selectedAnswer).toHaveTextContent("×");
  });

  test("正解、誤答でもない選択肢は何も付与されない", () => {
    render(
      <ResultSummary
        userAnswers={mockSelectedUserAnswers}
        indexMap={["A", "B", "C", "D"]}
      />
    );

    const otherAnswer = screen.getByText(/d/);
    expect(otherAnswer).not.toHaveClass("correct");
    expect(otherAnswer).not.toHaveClass("selected");
    expect(otherAnswer).not.toHaveTextContent("◯");
    expect(otherAnswer).not.toHaveTextContent("×");
  });
});
