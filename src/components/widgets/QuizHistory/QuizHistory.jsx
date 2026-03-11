//src/components/widgets/QuizHistory/QuizHistory.jsx

import React, { useState } from "react";
import "./QuizHistory.css";

import QuizHistoryItem from "./QuizHistoryItem";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";

import { useDispatch, useSelector } from "react-redux";
import { selectAllHistories } from "@/redux/features/quizHistory/quizHistorySelector";
import { deleteHistoryAsync } from "@/redux/features/quizHistory/quizHistoryThunks";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const QuizHistory = () => {
  const dispatch = useDispatch();

  const histories = useSelector(selectAllHistories);

  const { handleGoHome, handleRetryFromHistory } = useNavigationHelper();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);

  if (histories.length === 0) {
    return (
      <div>
        <h1 className="title">クイズの記録</h1>
        <p>記録がありません クイズに回答後 記録してください</p>
        <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">クイズの記録</h1>
      <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
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
                  historyDate={his.date}
                  historyCategory={his.category}
                  historyType={his.type}
                  historyScore={his.score}
                  historyTotalQuestions={his.totalQuestions}
                  historyAccuracy={his.accuracy}
                  historyDifficulty={his.difficulty}
                  onDelete={() => {
                    setIsModalOpen(true);
                    setTargetId(his.id);
                  }}
                  onRetry={() => handleRetryFromHistory(his.id)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* <Button onClickHandler={handleGoHome}>ホームへ戻る</Button> */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"この記録を削除しますか?"}
        onConfirm={() => {
          dispatch(deleteHistoryAsync({ id: targetId }));
          setIsModalOpen(false);
          setTargetId(null);
        }}
      />
    </div>
  );
};

export default QuizHistory;
