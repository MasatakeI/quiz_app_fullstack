import React from "react";
import "./Header.css";
import HeaderIconButton from "./HeaderIconButton";

import { useScrollY } from "@/hooks/useScrollY";
import { useHeaderIcons } from "./useHeaderIcons";

const Header = () => {
  const isScrolled = useScrollY(0);
  const { handleGoHome, headerIconButtons } = useHeaderIcons();

  return (
    <div role="banner" className={`header ${isScrolled ? "scrolled" : ""}`}>
      <h1 className="logo" onClick={handleGoHome}>
        クイズアプリ
      </h1>

      <div className="icons-container">
        {headerIconButtons.map((btn, index) => (
          <HeaderIconButton
            key={index}
            icon={btn.icon}
            title={btn.title}
            onClick={btn.onClick}
            isActive={btn.isActive}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;
