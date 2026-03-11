// src/hooks/useNavigationHelper.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { resetQuizContent } from "@/redux/features/quizContent/quizContentSlice";
import {
  resetQuizSettings,
  setQuizSettings,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import { selectAllHistories } from "@/redux/features/quizHistory/quizHistorySelector";
import { selectIsQuizInProgress } from "@/redux/features/quizProgress/quizProgressSelector";

export const useNavigationHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const histories = useSelector(selectAllHistories);
  const isQuizInProgress = useSelector(selectIsQuizInProgress);

  const confirmNavigation = () => {
    if (isQuizInProgress) {
      return window.confirm(
        "クイズの途中ですが中断してもよろしいですか？\n（これまでの回答は保存されません）",
      );
    }

    return true;
  };

  const handleGoHome = () => {
    if (!confirmNavigation()) return;

    dispatch(resetQuizSettings());
    dispatch(resetQuizContent());
    navigate("/");
  };

  const handleGoHistory = () => {
    if (!confirmNavigation()) return;

    navigate("/quiz/history");
  };

  const handleRetryFromHistory = (historyId) => {
    const targetHistory = histories.find((h) => h.id === historyId);

    if (!targetHistory) {
      // console.error("対象の履歴が見つかりませんでした");
      return;
    }

    const {
      category,
      type,
      difficulty,
      totalQuestions: amount,
    } = targetHistory;
    dispatch(resetQuizContent());

    dispatch(setQuizSettings({ category, type, difficulty, amount }));

    navigate(
      `/quiz/play/${category}?type=${type}&difficulty=${difficulty}&amount=${amount}`,
    );
  };

  return { handleGoHome, handleGoHistory, handleRetryFromHistory };
};
