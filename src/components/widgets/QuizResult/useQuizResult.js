//useQuizResult.js

import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";

import {
  selectIsQuizFinished,
  selectNumberOfCorrects,
  selectNumberOfIncorrects,
  selectResultData,
  selectUserAnswers,
} from "@/redux/features/quizProgress/quizProgressSelector";

import { getQuizTitle } from "../../../constants/quizCategories";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { selectHistoryCanPost } from "@/redux/features/quizHistory/quizHistorySelector";
import { useEffect, useRef } from "react";
import { addHistoryAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import {
  DIFFICULTY_LABELS,
  INDEX_MAP,
  TYPE_LABELS,
} from "@/constants/quizTranslations";

export const useQuizResult = () => {
  const dispatch = useDispatch();

  const { category } = useParams();
  const { handleGoHome, handleGoHistory } = useNavigationHelper();

  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const numberOfIncorrects = useSelector(selectNumberOfIncorrects);
  const userAnswers = useSelector(selectUserAnswers);

  const resultData = useSelector(selectResultData);
  const historyCanPost = useSelector(selectHistoryCanPost);
  const quizFinished = useSelector(selectIsQuizFinished);

  const hasSaved = useRef(false);
  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  const quizTitle = getQuizTitle(category);
  const getType = TYPE_LABELS[type] || "不明";
  const getDifficulty = DIFFICULTY_LABELS[difficulty] || "不明";

  const handleRetry = async () => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  };

  useEffect(() => {
    if (quizFinished && historyCanPost && resultData && !hasSaved.current) {
      dispatch(addHistoryAsync({ resultData }));
      hasSaved.current = true;
    }
  }, [dispatch, historyCanPost, quizFinished, resultData]);

  return {
    quizTitle,
    userAnswers,
    numberOfCorrects,
    numberOfIncorrects,
    handleGoHome,
    handleRetry,
    handleGoHistory,
    amount,
    getType,
    getDifficulty,
    INDEX_MAP,
  };
};
