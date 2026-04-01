// src/models/AuthModel.js

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

import { auth } from "@/firebase";

import { AuthError } from "./errors/auth/AuthError";
import { AUTH_ERROR_CODE } from "./errors/auth/authErrorCode";
import { AUTH_MESSAGE } from "./errors/auth/authMessages";

const validateEmailAndPassword = (email, password) => {
  if (!email || !password) {
    throw new AuthError({
      code: AUTH_ERROR_CODE.VALIDATION,
      message: AUTH_MESSAGE.REQUIRED,
    });
  }
  if (password.length < 6) {
    throw new AuthError({
      code: AUTH_ERROR_CODE.VALIDATION,
      message: AUTH_MESSAGE.PASSWORD_LENGTH,
    });
  }
};

const toAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
});

export const subscribeAuth = (onChange) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      onChange(toAuthUser(user));
    } else {
      onChange(null);
    }
  });
};

export const signUpUser = async (email, password) => {
  validateEmailAndPassword(email, password);

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await sendEmailVerification(user);

  return toAuthUser(user);
};

export const signInAnonymouslyUser = async () => {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;
  return toAuthUser(user);
};

export const signInUser = async (email, password) => {
  validateEmailAndPassword(email, password);

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  if (!user.emailVerified) {
    throw new AuthError({
      code: AUTH_ERROR_CODE.AUTH_INVALID,
      message: AUTH_MESSAGE.NOT_AUTHENTICATION,
    });
  }

  return toAuthUser(user);
};

export const signOutUser = async () => {
  await signOut(auth);
};
