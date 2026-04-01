// src/components/common/IconButton/IconButton.jsx

import React from "react";
import "./IconButton.css";

import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconButton = ({ title, onClick, icon, isDelete = false }) => {
  return (
    <Tooltip title={title}>
      <button
        className={`icon-button ${isDelete ? "delete" : "retry"}`}
        onClick={onClick}
        aria-label={title}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </Tooltip>
  );
};

export default IconButton;
