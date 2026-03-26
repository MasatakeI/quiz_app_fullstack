// src/components/widgets/AuthForm/useAuthForm.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthLoading } from "@/redux/features/auth/authSelector";

import {
  signUpUserAsync,
  signInUserAsync,
} from "@/redux/features/auth/authThunks";

export const useAuthForm = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsAuthLoading);

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      await dispatch(
        signUpUserAsync({
          email: signUpEmail,
          password: signUpPassword,
        }),
      ).unwrap();

      setSignUpEmail("");
      setSignUpPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      await dispatch(
        signInUserAsync({
          email: signInEmail,
          password: signInPassword,
        }),
      ).unwrap();

      setSignInEmail("");
      setSignInPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  const signUpState = {
    email: signUpEmail,
    setEmail: setSignUpEmail,
    password: signUpPassword,
    setPassword: setSignUpPassword,
    onSubmit: handleSignUp,
  };
  const signInState = {
    email: signInEmail,
    setEmail: setSignInEmail,
    password: signInPassword,
    setPassword: setSignInPassword,
    onSubmit: handleSignIn,
  };

  return {
    isLoading,
    signUpState,
    signInState,
  };
};
