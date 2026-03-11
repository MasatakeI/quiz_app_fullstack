import React from "react";

import "./ResultButtonContainer.css";

import Button from "@/components/common/Button/Button";
import { Box, Grid } from "@mui/material";

const BUTTON_CONFIGS = [
  {
    id: 1,
    key: "retry",
    variant: "secondary",
    title: "同じ条件でもう1度",
  },
  {
    id: 2,
    key: "home",
    variant: "tertiary",
    title: "ホームへ戻る",
  },
  {
    id: 3,
    key: "history",
    variant: "primary",
    title: "記録を見る",
  },
];

const ResultButtonContainer = ({
  onNavigate,
  onRetry,
  onNavigateToHistory,
}) => {
  const handlers = {
    retry: onRetry,
    home: onNavigate,
    history: onNavigateToHistory,
  };
  return (
    <div className="button-container bottom">
      <Box sx={{ flexGrow: 1 }} className="button-container bottom">
        <Grid container spacing={2}>
          {BUTTON_CONFIGS.map((btn) => {
            return (
              <Grid key={btn.id} size={{ xs: 12, sm: 6, lg: 4 }}>
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
