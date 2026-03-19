// src/redux/features/auth/authThunks.js

import { showSnackbar } from "../snackbar/snackbarSlice";
import { createModelThunk } from "../utils/createModelThunk";

import {
  subscribeAuth,
  signUpUser,
  signInUser,
  signOutUser,
  signInAnonymouslyUser,
} from "@/models/AuthModel";
import { mapAuthError } from "@/models/errors/auth/mapAuthError";
import { clearUser, setIsAuthChecked, setUser } from "./authSlice";

export const initAuthAsync = () => (dispatch) => {
  const unsubscribe = subscribeAuth((user) => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(clearUser());
    }

    dispatch(setIsAuthChecked());
  });

  return unsubscribe;
};

export const signUpUserAsync = createModelThunk(
  "auth/signUpUser",
  async ({ email, password }, thunkApi) => {
    try {
      const user = await signUpUser(email, password);

      thunkApi.dispatch(showSnackbar("登録成功! 送信メールを確認してください"));

      return user;
    } catch (error) {
      throw mapAuthError(error);
    }
  },
);

export const signInAnonymouslyUserAsync = createModelThunk(
  "auth/signInAnonymouslyUser",
  async (_, thunkApi) => {
    try {
      const user = await signInAnonymouslyUser();

      thunkApi.dispatch(showSnackbar("ログイン成功(匿名) !"));

      return user;
    } catch (error) {
      throw mapAuthError(error);
    }
  },
);
export const signInUserAsync = createModelThunk(
  "auth/signInUser",
  async ({ email, password }, thunkApi) => {
    try {
      const user = await signInUser(email, password);

      thunkApi.dispatch(showSnackbar("ログイン成功 !"));

      return user;
    } catch (error) {
      throw mapAuthError(error);
    }
  },
);

export const signOutUserAsync = createModelThunk(
  "auth/signOutUser",
  async (_, thunkApi) => {
    try {
      await signOutUser();
      thunkApi.dispatch(showSnackbar("ログアウト成功"));
      return;
    } catch (error) {
      throw mapAuthError(error);
    }
  },
);
