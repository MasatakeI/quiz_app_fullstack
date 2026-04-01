// Home/validation.js

export const validateQuizSettings = (category, type, difficulty, amount) => {
  if (!category) return "ジャンルを選択してください";
  if (!type) return "タイプを選択してください";
  if (!difficulty) return "レベルを選択してください";
  if (type !== "boolean" && !amount) return "問題数を選択してください";

  return null;
};
