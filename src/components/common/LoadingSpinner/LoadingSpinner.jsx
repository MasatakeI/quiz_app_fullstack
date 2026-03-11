//LoadingSpinner.jsx

import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loader-container">
      <div className="loader" data-testid="loader"></div>
    </div>
  );
};
export default LoadingSpinner;
