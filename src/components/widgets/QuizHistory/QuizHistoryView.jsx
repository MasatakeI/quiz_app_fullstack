import React from "react";
import QuizHistoryItem from "./QuizHistoryItem";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const QuizHistoryView = ({
  histories,
  onRetry,
  onDelete,
  onSelect,
  selectedIds,
}) => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="history-container">
        <Grid container spacing={2}>
          {histories.map((his) => {
            return (
              <Grid
                key={his.id}
                className="history-list"
                size={{ xs: 12, md: 6 }}
              >
                <QuizHistoryItem
                  key={his.id}
                  id={his.id}
                  historyDate={his.date}
                  historyCategory={his.category}
                  historyType={his.type}
                  historyScore={his.score}
                  historyTotalQuestions={his.totalQuestions}
                  historyAccuracy={his.accuracy}
                  historyDifficulty={his.difficulty}
                  onRetry={() => onRetry(his.id)}
                  onDelete={() => onDelete(his.id)}
                  isSelected={selectedIds.includes(his.id)}
                  onSelect={onSelect}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default QuizHistoryView;
