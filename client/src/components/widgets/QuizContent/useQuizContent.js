//useQuizContent.js

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  goToNextQuiz,
  submitAnswer,
} from "@/redux/features/quizProgress/quizProgressSlice";

import { judgeCorrectAnswer } from "@/models/QuizModel";

import {
  selectShuffledAnswers,
  selectTransilateCurrentDifficulty,
  selectCurrentIndex,
  selectNumberOfCorrects,
  selectNumberOfIncorrects,
  selectCurrentQuiz,
  selectQuizProgressPercent,
} from "@/redux/features/quizProgress/quizProgressSelector";

import { useParams, useSearchParams } from "react-router";
import { getQuizTitle } from "@/constants/quizCategories";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

export const useQuizContent = () => {
  const dispatch = useDispatch();

  const { handleGoHome } = useNavigationHelper();

  const [params] = useSearchParams();
  const { category } = useParams();
  const type = params.get("type");
  const amount = params.get("amount");

  const currentQuiz = useSelector(selectCurrentQuiz);

  const shuffledAnswers = useSelector(selectShuffledAnswers);
  const currentDifficulty = useSelector(selectTransilateCurrentDifficulty);

  const progress = useSelector(selectQuizProgressPercent);

  const currentIndex = useSelector(selectCurrentIndex);
  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const numberOfIncorrects = useSelector(selectNumberOfIncorrects);

  const [canPost, setCanPost] = useState(true);
  const [quizResult, setQuizResult] = useState(null);

  const title = getQuizTitle(category);

  const typeMap = {
    boolean: "2択",
    multiple: "4択",
  };

  const getType = typeMap[type];

  const indexMap = ["A", "B", "C", "D"];

  const answers = currentQuiz
    ? type === "multiple"
      ? shuffledAnswers
      : ["True", "False"]
    : [];

  const selectAnswer = (answer) => {
    if (!canPost) return;
    setCanPost(false);
    const isCorrect = judgeCorrectAnswer(currentQuiz, answer);

    setQuizResult({
      isCorrect,
      selected: answer,
      correct: currentQuiz.correctAnswer,
      message: isCorrect ? `正解!` : `不正解...`,
    });

    const allAnswers = [
      currentQuiz.correctAnswer,
      ...currentQuiz.incorrectAnswers,
    ];

    dispatch(submitAnswer({ currentQuiz, selectedAnswer: answer, allAnswers }));
  };

  const handleNext = () => {
    dispatch(goToNextQuiz());
    setCanPost(true);
    setQuizResult(null);
  };

  return {
    handleNext,
    selectAnswer,
    handleGoHome,

    quizResult,
    canPost,
    currentQuiz,

    answers,
    currentDifficulty,
    currentIndex,
    numberOfCorrects,
    numberOfIncorrects,
    type,
    amount,

    title,
    getType,
    indexMap,

    progress,
  };
};
