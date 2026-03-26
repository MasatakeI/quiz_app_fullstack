import { describe, test, expect, vi, beforeEach } from "vitest";

import { snackbarMiddleware } from "@/redux/middleware/snackbarMiddleware";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

import { isRejectedWithValue } from "@reduxjs/toolkit";

vi.mock("@reduxjs/toolkit", async () => {
  const actual = await vi.importActual("@reduxjs/toolkit");

  return {
    ...actual,
    isRejectedWithValue: vi.fn(),
  };
});

const dispatch = vi.fn();
const next = vi.fn();
const store = { dispatch };

describe("snackbarMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rejectWithValueされたactionでsnackbarをdispatchする", () => {
    isRejectedWithValue.mockReturnValue(true);
    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: { message: "ログイン失敗" },
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("ログイン失敗"));
    expect(next).toHaveBeenCalledWith(action);
  });

  test("payload.messageがない場合 デフォルト文言を返す", () => {
    isRejectedWithValue.mockReturnValue(true);
    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {},
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("エラーが発生しました"));
  });

  test("isRejectedWithValueが falseの場合 dispatchを呼ばない", () => {
    isRejectedWithValue.mockReturnValue(false);

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {
        message: "ログイン成功",
      },
    };

    middleware(action);

    expect(dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });
});
