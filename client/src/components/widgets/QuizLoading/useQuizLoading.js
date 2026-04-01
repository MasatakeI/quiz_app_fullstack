import { useSelector } from "react-redux";

import {
  selectIsLoading,
  selectFetchError,
} from "@/redux/features/quizContent/quizContentSelector";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

export const useQuizLoading = () => {
  const isLoading = useSelector(selectIsLoading);
  const fetchError = useSelector(selectFetchError);

  const { handleGoHome, handleRetry } = useNavigationHelper();

  return { isLoading, fetchError, handleGoHome, handleRetry };
};
