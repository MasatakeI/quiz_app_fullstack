// Button.test.jsx

import { describe, test, expect, beforeEach, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import Button from "@/components/common/Button/Button";
import userEvent from "@testing-library/user-event";

describe("Button.jsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("childrenが表示される", () => {
    render(<Button onClickHandler={() => {}} children={"送信"} />);

    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  test("クリック時にonClickHandlerが呼ばれる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClickHandler={onClick} children={"送信"} />);

    await user.click(screen.getByText("送信"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("clickable=falseの時,diabledになる", () => {
    render(
      <Button onClickHandler={() => {}} clickable={false} children={"送信"} />,
    );
    expect(screen.getByText("送信")).toBeDisabled();
  });

  test("variantに応じたクラスが付与される", () => {
    render(
      <Button
        onClickHandler={() => {}}
        variant="secondary"
        children={"送信"}
      />,
    );

    expect(screen.getByText("送信")).toHaveClass("button-secondary");
  });

  test("colorStatus がある時 正しいステータスクラスが付与される", () => {
    render(
      <Button onClickHandler={() => {}} colorStatus={"correct"}>
        送信
      </Button>,
    );

    const button = screen.getByRole("button", { name: "送信" });
    expect(button).toHaveClass("button-status-correct");

    render(
      <Button onClickHandler={() => {}} colorStatus={"incorrect"}>
        送信
      </Button>,
    );

    expect(button).toHaveClass(
      " button button button-primary button-status-correct",
    );
  });

  test("clickbale=falseかつcolorStatusなしの時 disabled=trueになる", () => {
    render(
      <Button
        onClickHandler={() => {}}
        children={"送信"}
        clickable={false}
        colorStatus={null}
      />,
    );

    expect(screen.getByRole("button", { name: "送信" })).toBeDisabled();
  });

  test("clickable=falseでもcolorStatusがあれば disabledにならない", () => {
    render(
      <Button
        onClickHandler={() => {}}
        children={"送信"}
        clickable={false}
        colorStatus={"correct"}
      />,
    );

    expect(screen.getByRole("button", { name: "送信" })).not.toBeDisabled();
  });

  test("デフォルトの props で正しいクラスと活性状態を持つ", () => {
    render(<Button onClickHandler={() => {}}>デフォルト</Button>);
    const button = screen.getByRole("button", { name: "デフォルト" });

    expect(button).toHaveClass("button button-primary");
    expect(button).not.toBeDisabled();
  });
});
