// page/QuizPage/QuizPage.jsx

import React, { useEffect } from "react";
import "./QuizPage.css";

import QuizLoading from "@/components/widgets/QuizLoading/QuizLoading";
import QuizContent from "@/components/widgets/QuizContent/QuizContent";
import QuizResult from "@/components/widgets/QuizResult/QuizResult";

import { useDispatch, useSelector } from "react-redux";

import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";
import {
  selectFetchError,
  selectIsLoading,
} from "@/redux/features/quizContent/quizContentSelector";
import {
  selectIsQuizFinished,
  selectIsQuizInProgress,
} from "@/redux/features/quizProgress/quizProgressSelector";
import { useParams, useSearchParams } from "react-router";

const QuizPage = () => {
  const dispatch = useDispatch();

  const { category } = useParams();
  const isLoading = useSelector(selectIsLoading);
  const fetchError = useSelector(selectFetchError);

  const isQuizInProgress = useSelector(selectIsQuizInProgress);
  const quizFinished = useSelector(selectIsQuizFinished);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  useEffect(() => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  }, [dispatch, category, type, difficulty, amount]);

  // クイズ実行中のコンポーネント内
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isQuizInProgress && !quizFinished) {
        e.preventDefault();
        e.returnValue = ""; // ブラウザ標準のダイアログを表示
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isQuizInProgress, quizFinished]);

  if (quizFinished) {
    return <QuizResult />;
  }
  if (isLoading || fetchError) {
    return <QuizLoading />;
  }

  return <QuizContent />;
};

export default QuizPage;
