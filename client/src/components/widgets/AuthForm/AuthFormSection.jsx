// src/components/widgets/AuthForm/AuthFormSection.jsx

import React from "react";

const AuthFormSection = ({
  title = "フォーム",
  emailId = "email-id",
  passwordId = "password-id",
  isLoading,

  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label htmlFor={emailId}>メールアドレス</label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor={passwordId}>パスワード</label>
        <input
          id={passwordId}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={isLoading} className="btn">
          {title}
        </button>
      </form>
    </div>
  );
};

export default AuthFormSection;
