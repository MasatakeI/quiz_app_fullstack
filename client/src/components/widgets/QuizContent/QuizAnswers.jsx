import React from "react";
import "./QuizAnswers.css";
import Button from "../../common/Button/Button";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const QuizAnswers = ({
  shuffledAnswers,
  onSelect,
  canPost,
  indexMap,
  selectedAnswer,
  correctAnswer,
}) => {
  const answers = shuffledAnswers.map((answer, index) => {
    let status = null;
    if (!canPost) {
      if (answer === correctAnswer) {
        status = "correct";
      } else if (answer === selectedAnswer) {
        status = "incorrect";
      }
    }

    return (
      <Grid
        size={
          shuffledAnswers.length === 4
            ? { xs: 12, sm: 6, lg: 3 }
            : { xs: 12, sm: 6 }
        }
        key={index}
        className="answer"
      >
        <Button
          // variant="secondary"
          onClickHandler={() => onSelect(answer)}
          clickable={canPost}
          colorStatus={status}
        >
          {indexMap[index]}. {answer}
        </Button>
      </Grid>
    );
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} className="quiz-answer-list">
        {answers}
      </Grid>
    </Box>
  );
};

export default QuizAnswers;
