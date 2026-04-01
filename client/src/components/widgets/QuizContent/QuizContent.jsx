// src/components/widgets/QuizContent/QuizContent

import React from "react";
import "./QuizContent.css";

import { useQuizContent } from "./useQuizContent";

import QuizAnswerAlert from "./QuizAnswerAlert";
import QuizAnswers from "./QuizAnswers";
import QuizContentView from "./QuizContentView";

const QuizContent = () => {
  const {
    selectAnswer,
    handleNext,
    quizResult,
    canPost,
    answers,
    currentDifficulty,
    currentIndex,
    currentQuiz,
    numberOfCorrects,
    numberOfIncorrects,
    type,

    amount,
    title,
    getType,
    indexMap,

    progress,
  } = useQuizContent();

  return (
    <div className="quiz-content">
      <QuizContentView
        title={title}
        getType={getType}
        currentQuiz={currentQuiz}
        currentDifficulty={currentDifficulty}
        type={type}
        amount={amount}
        currentIndex={currentIndex}
        numberOfCorrects={numberOfCorrects}
        numberOfIncorrects={numberOfIncorrects}
        progress={progress}
      />

      <QuizAnswerAlert quizResult={quizResult} onNext={handleNext} />

      <QuizAnswers
        shuffledAnswers={answers}
        onSelect={selectAnswer}
        canPost={canPost}
        indexMap={indexMap}
        selectedAnswer={quizResult?.selected}
        correctAnswer={quizResult?.correct}
      />
    </div>
  );
};

export default QuizContent;
