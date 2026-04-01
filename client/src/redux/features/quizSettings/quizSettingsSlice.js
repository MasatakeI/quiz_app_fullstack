// src/redux/features/quizSettings/quizSettingsSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const settingsInitialState = {
  category: "sports",
  type: "multiple",
  difficulty: "easy",
  amount: "10",
  settingError: { message: "", field: "" },
};

const quizSettingsSlice = createSlice({
  name: "quizSettings",
  initialState: settingsInitialState,

  reducers: {
    setQuizSettings: (state, action) => {
      return {
        ...state,
        ...action.payload,
        settingError: settingsInitialState.settingError,
      };
    },

    resetQuizSettings: () => settingsInitialState,

    updateSettings: (state, action) => {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
        if (state.settingError?.field === key) {
          state.settingError = settingsInitialState.settingError;
        }
      }
    },

    setSettingsError: (state, action) => {
      state.settingError = action.payload;
    },
  },
});

export const {
  setQuizSettings,
  resetQuizSettings,
  updateSettings,
  setSettingsError,
} = quizSettingsSlice.actions;

export default quizSettingsSlice.reducer;
