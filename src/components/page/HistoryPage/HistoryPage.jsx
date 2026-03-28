import React, { useEffect } from "react";
import "./HistoryPage.css";

import QuizHistory from "@/components/widgets/QuizHistory/QuizHistory";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/common/Button/Button";

import { useDispatch, useSelector } from "react-redux";
import {
  selectHistoryError,
  selectHistoryIsLoading,
} from "@/redux/features/quizHistory/quizHistorySelector";
import { fetchHistoriesAsync } from "@/redux/features/quizHistory/quizHistoryThunks";
import { selectUser } from "@/redux/features/auth/authSelector";
import { openAuthModal } from "@/redux/features/auth/authSlice";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectHistoryIsLoading);
  const error = useSelector(selectHistoryError);
  const user = useSelector(selectUser);

  const { handleGoHome } = useNavigationHelper();

  const userId = user?.uid;

  useEffect(() => {
    if (user && user.uid) {
      dispatch(fetchHistoriesAsync());
    }
  }, [dispatch, user]); // userId ではなく user オブジェクト全体を監視

  if (!userId) {
    return (
      <div className="no-user-container">
        <div className="no-user-messages">
          <h3>履歴を見るにはログインが必要です</h3>
          <p>アカウントを作成すると履歴を保存できます</p>
        </div>
        <div className="no-user">
          <Button onClickHandler={() => dispatch(openAuthModal())}>
            新規登録 / ログイン
          </Button>
          <Button onClickHandler={handleGoHome} variant="tertiary">
            クイズ一覧へ戻る
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <Button onClickHandler={() => dispatch(fetchHistoriesAsync())}>
          履歴再読み込み
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <QuizHistory />;
};

export default HistoryPage;
