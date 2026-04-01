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

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { selectHistoryCanPost } from "@/redux/features/quizHistory/quizHistorySelector";
import { useEffect, useRef } from "react";
import { addHistoryAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import {
  DIFFICULTY_LABELS,
  INDEX_MAP,
  TYPE_LABELS,
} from "@/constants/quizTranslations";
import { selectUser } from "@/redux/features/auth/authSelector";

import { closeAuthModal } from "@/redux/features/auth/authSlice";

export const useQuizResult = () => {
  const dispatch = useDispatch();

  const { category } = useParams();
  const { handleGoHome, handleGoHistory, handleSaveHistory, handleRetry } =
    useNavigationHelper();

  const numberOfCorrects = useSelector(selectNumberOfCorrects);
  const numberOfIncorrects = useSelector(selectNumberOfIncorrects);
  const userAnswers = useSelector(selectUserAnswers);
  const user = useSelector(selectUser);

  const resultData = useSelector(selectResultData);
  const quizFinished = useSelector(selectIsQuizFinished);
  const historyCanPost = useSelector(selectHistoryCanPost);

  const hasSaved = useRef(false);
  const isInitialLoggedIn = useRef(!!user);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  const quizTitle = getQuizTitle(category);
  const getType = TYPE_LABELS[type] || "不明";
  const getDifficulty = DIFFICULTY_LABELS[difficulty] || "不明";

  useEffect(() => {
    if (
      quizFinished &&
      user &&
      historyCanPost &&
      resultData &&
      !hasSaved.current
    ) {
      dispatch(addHistoryAsync({ resultData }))
        .unwrap()
        .then(() => {
          if (!isInitialLoggedIn.current) {
            handleGoHistory();
          }
        });

      hasSaved.current = true;
      dispatch(closeAuthModal());
    }
  }, [
    dispatch,
    user,
    historyCanPost,
    quizFinished,
    resultData,
    handleGoHistory,
  ]);

  return {
    quizTitle,
    userAnswers,
    numberOfCorrects,
    numberOfIncorrects,
    handleGoHome,
    handleRetry,
    handleGoHistory,
    handleSaveHistory,

    amount,
    getType,
    getDifficulty,
    INDEX_MAP,
  };
};
