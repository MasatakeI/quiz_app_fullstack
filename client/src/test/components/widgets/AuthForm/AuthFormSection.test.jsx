// src/test/components/widgets/AuthForm/AuthFormSection.jsx
import { describe, expect, test, vi } from "vitest";

import AuthFormSection from "@/components/widgets/AuthForm/AuthFormSection";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AuthFormSection", () => {
  const defaultProps = {
    title: "ログイン",
    email: "aaa@bbb.com",
    password: "zzzzzz",
    setEmail: vi.fn(),
    setPassword: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
    emailId: "test-email",
    passwordId: "test-password",
  };
  test("必要な項目が描画される", () => {
    render(<AuthFormSection {...defaultProps} />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    expect(emailInput).toHaveValue("aaa@bbb.com");
    expect(passwordInput).toHaveValue("zzzzzz");

    expect(passwordInput).toHaveAttribute("type", "password");

    const button = screen.getByRole("button", { name: "ログイン" });
    expect(button).toBeInTheDocument();
  });

  test("isLoading=trueの時,ボタンがdisabledになる", () => {
    render(<AuthFormSection {...defaultProps} isLoading={true} />);
    const button = screen.getByRole("button", { name: "ログイン" });

    expect(button).toBeDisabled();
  });

  test("ユーザーが入力欄に文字を打ち込んだときに setEmail や setPassword が正しく呼ばれる", async () => {
    const user = userEvent.setup();
    const mockSetEmail = vi.fn();
    const mockSetPassword = vi.fn();
    render(
      <AuthFormSection
        {...defaultProps}
        email={""}
        setEmail={mockSetEmail}
        password={""}
        setPassword={mockSetPassword}
      />,
    );

    const emailInput = screen.getByLabelText("メールアドレス");
    const email = "aaa@bbb.com";

    await user.type(emailInput, email);
    expect(mockSetEmail).toHaveBeenLastCalledWith("m");

    const passwordInput = screen.getByLabelText("パスワード");
    const password = "zzzzzz";

    await user.type(passwordInput, password);
    expect(mockSetPassword).toHaveBeenLastCalledWith("z");
  });
});
