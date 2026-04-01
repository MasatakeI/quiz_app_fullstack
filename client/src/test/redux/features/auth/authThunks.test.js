// src/test/redux/features/auth/authThunks.js
import { describe, expect, test, vi, beforeEach } from "vitest";

import {
  signUpUserAsync,
  signInAnonymouslyUserAsync,
  signInUserAsync,
  signOutUserAsync,
  initAuthAsync,
} from "@/redux/features/auth/authThunks";
import {
  signInAnonymouslyUser,
  signInUser,
  signOutUser,
  signUpUser,
  subscribeAuth,
} from "@/models/AuthModel";

import { AuthError } from "@/models/errors/auth/AuthError";
import { AUTH_ERROR_CODE } from "@/models/errors/auth/authErrorCode";
import {
  clearUser,
  setIsAuthChecked,
  setUser,
} from "@/redux/features/auth/authSlice";

//モック

vi.mock("@/models/AuthModel", () => ({
  subscribeAuth: vi.fn(),
  signUpUser: vi.fn(),
  signInAnonymouslyUser: vi.fn(),
  signInUser: vi.fn(),
  signOutUser: vi.fn(),
}));

// ヘルパー

const mockSuccess = (fn, value) => fn.mockResolvedValue(value);
const mockError = (fn, code, message) =>
  fn.mockRejectedValue(new AuthError({ code, message }));

const dispatch = vi.fn();
const getState = vi.fn();
const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

describe("authThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const email = "xxx@xxx.com";
  const password = "aaaaaa";

  const mockUser = { email, password };

  describe("initUserAsync", () => {
    test("認証状態が変化した時に setUserと setIsAuthCheckedが dispatchされる", async () => {
      let authCallback;

      subscribeAuth.mockImplementation((cb) => {
        authCallback = cb;
        return vi.fn();
      });

      const unsubscribe = initAuthAsync()(dispatch);
      authCallback(mockUser);

      expect(dispatch).toHaveBeenCalledWith(setUser(mockUser));
      expect(dispatch).toHaveBeenCalledWith(setIsAuthChecked());

      authCallback(null);

      expect(dispatch).toHaveBeenCalledWith(clearUser());

      expect(typeof unsubscribe).toBe("function");
    });
  });

  describe("正常系 共通処理", () => {
    test.each([
      {
        title: "signUpUserAsync",
        mockFn: signUpUser,
        value: mockUser,
        thunk: signUpUserAsync,
        params: { email: mockUser.email, password: mockUser.password },
      },
      {
        title: "signInAnonymouslyUserAsync",
        mockFn: signInAnonymouslyUser,
        value: undefined,
        thunk: signInAnonymouslyUserAsync,
        params: undefined,
      },
      {
        title: "signInUserAsync",
        mockFn: signInUser,
        value: mockUser,
        thunk: signInUserAsync,
        params: { email: mockUser.email, password: mockUser.password },
      },
      {
        title: "signOutUserAsync",
        mockFn: signOutUser,
        value: undefined,
        thunk: signOutUserAsync,
        params: undefined,
      },
    ])("$title", async ({ mockFn, value, thunk, params }) => {
      mockSuccess(mockFn, value);
      const result = await callThunk(thunk, params);

      if (value) {
        expect(result.payload).toEqual(value);
      }

      if (params) {
        expect(mockFn).toHaveBeenCalledWith(mockUser.email, mockUser.password);
      } else {
        expect(mockFn).toHaveBeenCalled();
      }

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("showSnackbar"),
        }),
      );
    });
  });

  describe("異常系 共通処理", () => {
    test.each([
      {
        title: "signUpUserAsync",
        mockFn: signUpUser,
        thunk: signUpUserAsync,
      },
      {
        title: "signInAnonymouslyUserAsync",
        mockFn: signInAnonymouslyUser,
        thunk: signInAnonymouslyUserAsync,
      },
      {
        title: "signInUserAsync",
        mockFn: signInUser,
        thunk: signInUserAsync,
      },
      {
        title: "signOutUserAsync",
        mockFn: signOutUser,
        thunk: signOutUserAsync,
      },
    ])("$title", async ({ mockFn, thunk }) => {
      const normalizedError = new AuthError({
        code: AUTH_ERROR_CODE.VALIDATION,
        message: "エラー",
      });

      mockError(mockFn, normalizedError.code, normalizedError.message);

      const result = await callThunk(thunk, {
        email: "",
        password: "",
      });

      expect(result.payload).toEqual({
        code: AUTH_ERROR_CODE.VALIDATION,
        message: "エラー",
      });
    });
  });
});
