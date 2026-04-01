// src/components/widgets/AuthForm/AuthForm.jsx

import "./AuthForm.css";

import { useAuthForm } from "./useAuthForm";
import AuthFormView from "./AuthFormView";

const AuthForm = () => {
  const { isLoading, signUpState, signInState } = useAuthForm();

  return (
    <AuthFormView
      isLoading={isLoading}
      signUpState={signUpState}
      signInState={signInState}
      signUp={signUpState.onSubmit}
      signIn={signInState.onSubmit}
    />
  );
};

export default AuthForm;
