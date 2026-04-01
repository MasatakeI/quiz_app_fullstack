// src/components/widgets/QuizResult/QuizResult

import React from "react";

import { useQuizResult } from "./useQuizResult";

import ResultSummary from "./ResultSummary/ResultSummary";
import QuizResultView from "./QuizResultView";
import ResultButtonContainer from "./ResultButtonContainer";

const QuizResult = () => {
  const {
    quizTitle,
    userAnswers,
    numberOfCorrects,
    numberOfIncorrects,

    amount,
    getType,
    getDifficulty,
    INDEX_MAP,

    handleGoHome,
    handleRetry,
    handleGoHistory,
    handleSaveHistory,
  } = useQuizResult();

  return (
    <div className="quiz-result">
      <QuizResultView
        quizTitle={quizTitle}
        numberOfCorrects={numberOfCorrects}
        numberOfIncorrects={numberOfIncorrects}
        amount={amount}
        currentDifficulty={getDifficulty}
        getType={getType}
      />

      <ResultButtonContainer
        onNavigate={handleGoHome}
        onRetry={handleRetry}
        onNavigateToHistory={handleGoHistory}
        onSaveHistory={handleSaveHistory}
      />

      <ResultSummary userAnswers={userAnswers} indexMap={INDEX_MAP} />

      <ResultButtonContainer
        onNavigate={handleGoHome}
        onRetry={handleRetry}
        onNavigateToHistory={handleGoHistory}
        onSaveHistory={handleSaveHistory}
      />
    </div>
  );
};

export default QuizResult;
