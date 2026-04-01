// src/components/widgets/QuizResult/ResultSummary/ResultSummary.jsx

import React from "react";
import "./ResultSummary.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const ResultSummary = ({ indexMap, userAnswers }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className="result-summary">
        {userAnswers.map((answerData, index) => {
          const { question, correctAnswer, selectedAnswer, allAnswers } =
            answerData;

          const answers = allAnswers.map((answer, i) => {
            const isCorrect = answer === correctAnswer;
            const isSelected = answer === selectedAnswer;

            return (
              <li
                key={i}
                className={`result-answer ${
                  isCorrect ? "correct" : isSelected ? "selected" : ""
                }`}
              >
                {indexMap[i]}. {answer}{" "}
                {isCorrect ? "◯" : isSelected ? "×" : ""}
              </li>
            );
          });

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={index} className="result-card">
              <p className="result-question">
                Q{index + 1}. {question}
              </p>
              <ul className="result-answers">{answers}</ul>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ResultSummary;
