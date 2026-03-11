import React, { useEffect, useState } from "react";
import "./Header.css";
import HeaderIconButton from "./HeaderIconButton";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { faHistory, faHome } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";

const Header = () => {
  const { handleGoHome, handleGoHistory } = useNavigationHelper();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div role="banner" className={`header ${isScrolled ? "scrolled" : ""}`}>
      <h1 className="logo" onClick={handleGoHome} style={{ cursor: "pointer" }}>
        クイズアプリ
      </h1>

      <div className="icons-container">
        <HeaderIconButton
          icon={faHome}
          title={"ホームへ戻る"}
          onClick={handleGoHome}
          isActive={location.pathname === "/"}
        />
        <HeaderIconButton
          icon={faHistory}
          title={"クイズの記録を見る"}
          onClick={handleGoHistory}
          isActive={location.pathname === "/quiz/history"}
        />
      </div>
    </div>
  );
};

export default Header;
