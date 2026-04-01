export const selectQuizSettings = (state) => state.quizSettings;

export const selectSettingsCategory = (state) => state.quizSettings.category;
export const selectSettingsType = (state) => state.quizSettings.type;
export const selectSettingsDifficulty = (state) =>
  state.quizSettings.difficulty;
export const selectSettingsAmount = (state) => state.quizSettings.amount;
export const selectSettingError = (state) => state.quizSettings.settingError;
