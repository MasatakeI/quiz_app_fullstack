import React, { useEffect } from "react";

import QuizHistory from "@/components/widgets/QuizHistory/QuizHistory";
import { useDispatch, useSelector } from "react-redux";
import {
  selectHistoryError,
  selectHistoryIsLoading,
} from "@/redux/features/quizHistory/quizHistorySelector";
import { fetchHistoriesAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/common/Button/Button";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectHistoryIsLoading);
  const error = useSelector(selectHistoryError);

  useEffect(() => {
    dispatch(fetchHistoriesAsync());
  }, [dispatch]);

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <Button onClickHandler={() => dispatch(fetchHistoriesAsync())}>
          履歴再読み込み
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <QuizHistory />;
};

export default HistoryPage;
