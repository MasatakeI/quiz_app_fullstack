//src/components/common/BackToHomeLink/BackToHomeLink.jsx

import React from "react";
import "./BackToHomeLink.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import Tooltip from "@mui/material/Tooltip";

const BackToHomeLink = ({ linkHandler }) => {
  return (
    <div className="link-container">
      <hr />
      <Tooltip title="ホームへ戻る">
        <button
          className="link-button"
          onClick={linkHandler}
          aria-label="ホームへ戻る"
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      </Tooltip>
    </div>
  );
};

export default BackToHomeLink;
