import { createAsyncThunk } from "@reduxjs/toolkit";

export const createModelThunk = (type, fn, options) =>
  createAsyncThunk(
    type,
    async (arg, thunkApi) => {
      try {
        return await fn(arg, thunkApi);
      } catch (error) {
        if (error?.code && error?.message) {
          return thunkApi.rejectWithValue({
            code: error.code,
            message: error.message,
            field: error.field,
          });
        }
        return thunkApi.rejectWithValue({
          code: "UNKNOWN",
          message: "予期せぬエラーが発生しました",
        });
      }
    },
    options,
  );
