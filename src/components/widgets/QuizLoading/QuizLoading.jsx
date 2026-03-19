import React from "react";
import "./QuizLoading.css";

import Button from "@/components/common/Button/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { useQuizLoading } from "./useQuizLoading";

const QuizLoading = () => {
  const { isLoading, fetchError, handleGoHome, handleRetry } = useQuizLoading();

  if (fetchError) {
    return (
      <div className="quiz-loading">
        <p>{fetchError.message}</p>

        <div className="quiz-loading-button-container">
          <Button onClickHandler={handleRetry}>再読み込み</Button>
          <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return null;
};

export default QuizLoading;
