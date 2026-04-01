// src/hooks/useNavigationHelper.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { resetQuizContent } from "@/redux/features/quizContent/quizContentSlice";
import {
  resetQuizSettings,
  setQuizSettings,
} from "@/redux/features/quizSettings/quizSettingsSlice";
import { selectAllHistories } from "@/redux/features/quizHistory/quizHistorySelector";
import {
  selectIsQuizInProgress,
  selectResultData,
} from "@/redux/features/quizProgress/quizProgressSelector";
import { addHistoryAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import { selectUser } from "@/redux/features/auth/authSelector";
import { openAuthModal } from "@/redux/features/auth/authSlice";
import { signOutUserAsync } from "@/redux/features/auth/authThunks";
import { fetchQuizzesAsync } from "@/redux/features/quizContent/quizContentThunks";

export const useNavigationHelper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const histories = useSelector(selectAllHistories);
  const isQuizInProgress = useSelector(selectIsQuizInProgress);
  const resultData = useSelector(selectResultData);
  const user = useSelector(selectUser);

  const [params] = useSearchParams();
  const type = params.get("type");
  const difficulty = params.get("difficulty");
  const amount = params.get("amount");

  const handleRetry = async () => {
    dispatch(fetchQuizzesAsync({ category, type, difficulty, amount }));
  };

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
    dispatch(resetQuizSettings());
    dispatch(resetQuizContent());
    navigate("/quiz/history");
  };

  const handleSaveHistory = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    dispatch(addHistoryAsync({ resultData }));
  };

  const handleOpenModal = () => {
    dispatch(openAuthModal());
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

  const handleSignOut = async () => {
    dispatch(signOutUserAsync());
    navigate("/");
  };

  return {
    handleRetry,
    handleGoHome,
    handleGoHistory,
    handleRetryFromHistory,
    handleSaveHistory,
    handleOpenModal,
    handleSignOut,
  };
};
