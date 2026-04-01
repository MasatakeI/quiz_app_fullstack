import React from "react";

import "./ResultButtonContainer.css";

import Button from "@/components/common/Button/Button";
import { Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/authSelector";

const BUTTON_CONFIGS = [
  {
    id: 1,
    key: "retry",
    variant: "secondary",
    title: "同じ条件でもう1度",
    show: "always",
  },
  {
    id: 2,
    key: "home",
    variant: "tertiary",
    title: "ホームへ戻る",
    show: "always",
  },
  {
    id: 3,
    key: "history",
    variant: "primary",
    title: "記録を見る",
    show: "loggedIn",
  }, // ログイン時のみ
  {
    id: 4,
    key: "signIn",
    variant: "quaternary",
    title: "ログインして保存",
    show: "loggedOut",
  }, // 未ログイン時のみ
];

const ResultButtonContainer = ({
  onNavigate,
  onRetry,
  onNavigateToHistory,
  onSaveHistory,
}) => {
  const user = useSelector(selectUser);
  const isLoggedIn = !!user;
  const handlers = {
    retry: onRetry,
    home: onNavigate,
    history: onNavigateToHistory,
    signIn: onSaveHistory,
  };

  const visibleButtons = BUTTON_CONFIGS.filter((btn) => {
    if (btn.show === "always") return true;

    return btn.show === "loggedIn" ? isLoggedIn : !isLoggedIn;
  });

  return (
    <div className="button-container bottom">
      <Box sx={{ flexGrow: 1 }} className="button-container bottom">
        <Grid container spacing={2}>
          {visibleButtons.map((btn) => {
            return (
              <Grid key={btn.id} size={{ xs: 6, lg: 4 }}>
                <Button
                  variant={btn.variant}
                  onClickHandler={handlers[btn.key]}
                >
                  {btn.title}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default ResultButtonContainer;
