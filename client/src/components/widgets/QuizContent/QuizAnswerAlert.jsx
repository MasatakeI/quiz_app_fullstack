import React from "react";
import "./QuizAnswerAlert.css";
import Button from "../../common/Button/Button";
import AnswerAlert from "../../common/AnswerAlert/AnswerAlert";

const QuizAnswerAlert = ({ quizResult, onNext }) => {
  if (!quizResult) return;

  return (
    <div className="answer-message-container">
      <AnswerAlert
        message={quizResult.message}
        severity={quizResult.isCorrect ? "success" : "error"}
      />
      <Button onClickHandler={onNext}>次へ</Button>
    </div>
  );
};

export default QuizAnswerAlert;
