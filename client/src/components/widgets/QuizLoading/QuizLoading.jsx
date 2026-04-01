import React from "react";
import "./QuizLoading.css";

import Button from "@/components/common/Button/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { useQuizLoading } from "./useQuizLoading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const QuizLoading = () => {
  const { isLoading, fetchError, handleGoHome, handleRetry } = useQuizLoading();

  if (fetchError) {
    return (
      <div className="quiz-loading">
        <p>読み込みに失敗しました</p>
        <div className="error-icon">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>
        <div className="quiz-loading-button-container">
          <Button onClickHandler={handleRetry}>再読み込み</Button>
          <Button onClickHandler={handleGoHome} variant="secondary">
            クイズ一覧へ戻る
          </Button>
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
