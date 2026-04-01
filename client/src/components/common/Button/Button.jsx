// common/Button/Button.jsx

import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClickHandler,
  variant = "primary",
  clickable = true,
  colorStatus,
}) => {
  const baseClass = "button";
  const variantClass = `button button-${variant}`;
  const statusClass = colorStatus ? `button-status-${colorStatus}` : "";
  const classes = [baseClass, variantClass, statusClass];

  const buttonClass = classes.filter(Boolean).join(" ");

  return (
    <button
      className={buttonClass}
      onClick={onClickHandler}
      disabled={!clickable && !colorStatus}
    >
      {children}
    </button>
  );
};

export default Button;
