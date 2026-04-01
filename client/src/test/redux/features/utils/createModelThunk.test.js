import { describe, test, expect, vi, beforeEach } from "vitest";

import { createModelThunk } from "@/redux/features/utils/createModelThunk";

import { QuizError } from "@/models/errors/quiz/QuizError";

const dispatch = vi.fn();
const getState = vi.fn();

describe("createModelThunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("fn終了時はfulfilledになる", async () => {
    const thunk = createModelThunk("test/success", async () => {
      return "Success";
    });

    const result = await thunk()(dispatch, getState, undefined);
    expect(result.type).toBe("test/success/fulfilled");
    expect(result.payload).toBe("Success");
  });

  test("QuizErrorの時はrejectWithValueされる", async () => {
    const thunk = createModelThunk("test/quizError", async () => {
      throw new QuizError({
        code: "VALIDATION",
        message: "不正な入力です",
        field: "name",
      });
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: "VALIDATION",
      message: "不正な入力です",
      field: "name",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });

  test("QuizError以外の未知のエラーはUNKNOWNを返す", async () => {
    const thunk = createModelThunk("test/unknownError", async () => {
      throw new Error("Normal error");
    });
    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe(thunk.rejected.type);

    expect(result.payload).toEqual({
      code: "UNKNOWN",
      message: "予期せぬエラーが発生しました",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });

  test("optinosのconditionが反映される", async () => {
    const fn = vi.fn();
    const thunk = createModelThunk("test/condition", fn, {
      condition: () => false,
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe("test/condition/rejected");
    expect(fn).not.toHaveBeenCalled();
    expect(result.meta.condition).toBe(true);
  });
});
