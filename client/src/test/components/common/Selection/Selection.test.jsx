import { describe, expect, test, vi, beforeEach } from "vitest";

import Selection from "@/components/common/Selection/Selection";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockArray = [
  { id: 1, value: "sports", title: "スポーツ" },
  { id: 2, value: "music", title: "音楽" },
];

describe("Selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("配列に基づいて 選択肢が表示される", async () => {
    const user = userEvent.setup();
    render(
      <Selection
        array={mockArray}
        error={false}
        label={"ジャンル"}
        value={""}
      />,
    );

    const select = screen.getByLabelText("ジャンル");
    await user.click(select);

    expect(screen.getByText("スポーツ")).toBeInTheDocument();
    expect(screen.getByText("音楽")).toBeInTheDocument();
  });

  test("値を選択した時 onChangeが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(
      <Selection
        array={mockArray}
        error={false}
        label={"ジャンル"}
        value={""}
        onChange={mockOnChange}
      />,
    );

    const select = screen.getByLabelText("ジャンル");
    await user.click(select);
    await user.click(screen.getByText("スポーツ"));

    expect(mockOnChange).toHaveBeenCalled();
  });
  test("error=trueの時 エラーメッセージが表示される", () => {
    render(
      <Selection
        array={mockArray}
        error={true}
        label={"ジャンル"}
        value={""}
      />,
    );
    expect(screen.getByText("選択してください"));
  });
});
