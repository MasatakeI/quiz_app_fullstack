//useHomePage.js

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAmounts, getCategories, getDifficulties, types } from "./constants";
import {
  selectSettingError,
  selectSettingsAmount,
  selectSettingsCategory,
  selectSettingsDifficulty,
  selectSettingsType,
} from "@/redux/features/quizSettings/quizSettingsSelector";

import {
  setQuizSettings,
  setSettingsError,
  updateSettings,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import { useMemo } from "react";
import { validateQuizSettings } from "@/models/QuizModel";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

export const useHomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const type = useSelector(selectSettingsType);
  const categories = getCategories();
  const difficulties = getDifficulties(type);
  const amounts = getAmounts(type);

  const difficulty = useSelector(selectSettingsDifficulty);
  const category = useSelector(selectSettingsCategory);
  const amount = useSelector(selectSettingsAmount);
  const settingError = useSelector(selectSettingError);

  const items = useMemo(
    () => [
      {
        key: "category",
        label: "ジャンル",
        value: category,
        onChange: (v) =>
          dispatch(updateSettings({ key: "category", value: v })),
        array: categories,
        error: settingError?.field === "category",
      },
      {
        key: "type",
        label: "タイプ",
        value: type,
        onChange: (v) => {
          dispatch(updateSettings({ key: "type", value: v }));
          dispatch(
            updateSettings({ key: "amount", value: v === "boolean" ? 5 : 10 }),
          );
        },
        array: types,
        error: settingError?.field === "type",
      },
      {
        key: "difficulty",
        label: "レベル",
        value: difficulty,
        onChange: (v) =>
          dispatch(updateSettings({ key: "difficulty", value: v })),
        array: difficulties,
        error: settingError?.field === "difficulty",
      },
      {
        key: "amount",
        label: "問題数",
        value: amount,
        onChange: (v) => dispatch(updateSettings({ key: "amount", value: v })),
        array: amounts,
        disabled: type === "boolean",
        error: settingError?.field === "amount",
      },
    ],
    [dispatch, category, type, difficulty, amount, settingError?.field],
  );

  const handleStart = () => {
    const settingValues = { category, type, difficulty, amount };

    try {
      validateQuizSettings(settingValues);
      const finalAmount = type === "boolean" ? 5 : amount;

      dispatch(setQuizSettings(settingValues));

      navigate(
        `/quiz/play/${category}?type=${type}&difficulty=${difficulty}&amount=${finalAmount}`,
      );
    } catch (error) {
      dispatch(
        setSettingsError({ message: error.message, field: error.field }),
      );
      dispatch(showSnackbar(error.message));
    }
  };

  return {
    items,
    handleStart,
  };
};
