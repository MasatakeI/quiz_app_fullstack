// src/redux/store/rootReducer.js
import { combineReducers } from "redux";

import quizContentReducer from "../features/quizContent/quizContentSlice";
import quizProgressReducer from "../features/quizProgress/quizProgressSlice";
import quizSettingsReducer from "../features/quizSettings/quizSettingsSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";
import quizHistoryReducer from "@/redux/features/quizHistory/quizHistorySlice";
import authReducer from "@/redux/features/auth/authSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const settingsPersistConfig = {
  key: "quizSettings",
  storage,
  blacklist: ["settingsError"],
};

export const rootReducer = combineReducers({
  quizContent: quizContentReducer,
  quizProgress: quizProgressReducer,
  quizSettings: persistReducer(settingsPersistConfig, quizSettingsReducer),
  snackbar: snackbarReducer,
  quizHistory: quizHistoryReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
