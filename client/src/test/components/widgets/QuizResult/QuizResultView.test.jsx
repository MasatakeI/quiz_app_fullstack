//QuizResultView.test.jsx

import { screen, render } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import QuizResultView from "@/components/widgets/QuizResult/QuizResultView";

describe("QuizResultView", () => {
  test("指定した条件と 正解数 誤答数 正答率 が表示される", () => {
    render(
      <QuizResultView
        quizTitle={"スポーツ"}
        numberOfCorrects={3}
        numberOfIncorrects={7}
        currentDifficulty={"かんたん"}
        amount={10}
        getType={"4択"}
        difficultyMap={{
          easy: "かんたん",
          medium: "ふつう",
          hard: "むずかしい",
        }}
        difficulty={"easy"}
      />,
    );
    expect(screen.getByText("スポーツクイズ 結果")).toBeInTheDocument();
    expect(screen.getByText("Level かんたん")).toBeInTheDocument();
    expect(screen.getByText("Type 4択")).toBeInTheDocument();
    expect(screen.getByText("Total 10")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();

    expect(screen.getByText("正解")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("誤答")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
