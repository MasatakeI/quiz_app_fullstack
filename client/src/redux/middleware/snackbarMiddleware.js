// src/redux/middleware/snackbarMiddleware.js

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showSnackbar } from "../features/snackbar/snackbarSlice";

export const snackbarMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (isRejectedWithValue(action) && !action.type?.startsWith("snackbar/")) {
    const message = action.payload?.message ?? "エラーが発生しました";
    store.dispatch(showSnackbar(message));
  }

  return result;
};
