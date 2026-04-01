import { describe, expect, test, vi, beforeEach } from "vitest";

import {
  subscribeAuth,
  signUpUser,
  signInAnonymouslyUser,
  signInUser,
  signOutUser,
} from "@/models/AuthModel";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "firebase/auth";

import { auth } from "@/firebase";
import { AuthError } from "@/models/errors/auth/AuthError";

import { AUTH_ERROR_CODE } from "@/models/errors/auth/authErrorCode";
import { AUTH_MESSAGE } from "@/models/errors/auth/authMessages";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInAnonymously: vi.fn(),
  getAuth: vi.fn(),
}));

describe("AuthModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const email = "xxx@yyy.com";
  const password = "xxxzzz";

  describe("subscribeAuth", () => {
    test("Firebase のログイン状態の変化を監視して ユーザー情報を変換して通知する", () => {
      const callback = vi.fn();

      onAuthStateChanged.mockImplementation((_, cb) => {
        cb({ uid: "a", email, emailVerified: false });
        return vi.fn();
      });

      subscribeAuth(callback);

      expect(callback).toHaveBeenCalledWith({
        uid: "a",
        email,
        emailVerified: false,
      });
    });

    test("user情報が空(ログアウト状態)の場合 ", () => {
      const callback = vi.fn();

      onAuthStateChanged.mockImplementation((_, cb) => {
        cb(null);
        return vi.fn();
      });

      subscribeAuth(callback);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe("signUpUser", () => {
    test("成功: ユーザー作成とメール認証が呼ばれ サインアップしたuser情報を返す", async () => {
      const mockUser = {
        uid: "a",
        email,
        emailVerified: false,
      };
      createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const result = await signUpUser(email, password);
      expect(result).toEqual({
        uid: "a",
        email: "xxx@yyy.com",
        emailVerified: false,
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        email,
        password,
      );

      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("signInAnonymouslyUser", () => {
    test("成功: ログイン成功時 ユーザー情報を返す", async () => {
      const mockUser = {
        uid: "a",
        email,
        emailVerified: false,
      };
      signInAnonymously.mockResolvedValue({ user: mockUser });

      const result = await signInAnonymouslyUser(email, password);
      expect(result).toEqual({
        uid: "a",
        email: "xxx@yyy.com",
        emailVerified: false,
      });

      expect(signInAnonymously).toHaveBeenCalledWith(auth);
    });
  });

  describe("signInUser", () => {
    test("成功: ログイン成功時 ユーザー情報を返す", async () => {
      const mockUser = {
        uid: "a",
        email,
        emailVerified: true,
      };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      const result = await signInUser(email, password);
      expect(result).toEqual({
        uid: "a",
        email: "xxx@yyy.com",
        emailVerified: true,
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        email,
        password,
      );
    });

    test("異常系:メールアドレスが未承認の場合 ログインできない", async () => {
      const mockUser = {
        uid: "a",
        email,
        emailVerified: false,
      };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      await expect(signInUser(email, password)).rejects.toMatchObject({
        code: AUTH_ERROR_CODE.AUTH_INVALID,
        message: AUTH_MESSAGE.NOT_AUTHENTICATION,
      });
    });
  });
  describe("signOutUser", () => {
    test("成功: ログアウトする", async () => {
      signOut.mockResolvedValue();

      await signOutUser();

      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe("バリデーション共通処理", () => {
    test.each([
      {
        title: "メールアドレスまたはパスワードが空の時",
        email: "",
        password: "",
        code: AUTH_ERROR_CODE.VALIDATION,
        message: AUTH_MESSAGE.REQUIRED,
      },
      {
        title: "パスワードが6文字以下の時",
        email: "aaa@xxx.com",
        password: "zzz",
        code: AUTH_ERROR_CODE.VALIDATION,
        message: AUTH_MESSAGE.PASSWORD_LENGTH,
      },
    ])("$title", ({ email, password, code, message }) => {
      [signUpUser, signInUser].forEach(async (fn) => {
        await expect(fn(email, password)).rejects.toBeInstanceOf(AuthError);
        await expect(fn(email, password)).rejects.toMatchObject({
          code,
          message,
        });
      });
    });
  });

  describe("異常系共通処理:Firebase SDKエラー ", () => {
    test.each([
      {
        title: "signUpUser",
        fn: () => signUpUser(email, password),
        mockFn: createUserWithEmailAndPassword,
      },
      {
        title: "signInAnonymouslyUser",
        fn: () => signInAnonymouslyUser(email, password),
        mockFn: signInAnonymously,
      },
      {
        title: "signInUser",
        fn: () => signInUser(email, password),
        mockFn: signInWithEmailAndPassword,
      },
      {
        title: "signOutUser",
        fn: () => signOutUser(),
        mockFn: signOut,
      },
    ])("$title", async ({ fn, mockFn }) => {
      const error = new Error("firebase error");

      mockFn.mockRejectedValue(error);

      await expect(fn).rejects.toBe(error);
    });
  });
});
