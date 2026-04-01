// src/components/layout/Header/HeaderIconButton.jsx

import React from "react";
import "./HeaderIconButton.css";

import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderIconButton = ({ title, onClick, icon, isActive }) => {
  return (
    <Tooltip title={title}>
      <button
        className={`header-button ${isActive ? "active" : ""} `}
        onClick={onClick}
        aria-label={title}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </Tooltip>
  );
};

export default HeaderIconButton;
