// src/redux/store/index.js

import { configureStore } from "@reduxjs/toolkit";

import { snackbarMiddleware } from "../middleware/snackbarMiddleware";

import { persistStore } from "redux-persist";
import { persistedReducer } from "./rootReducer";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      snackbarMiddleware,
    ),
});

export const persistor = persistStore(store);
