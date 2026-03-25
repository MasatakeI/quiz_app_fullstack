import React from "react";
import HomePage from "./components/page/HomePage/HomePage";
import QuizPage from "./components/page/QuizPage/QuizPage";
import HistoryPage from "./components/page/HistoryPage/HistoryPage";

import { Routes, Route, Navigate } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz/history" element={<HistoryPage />} />
      <Route path="/quiz/play/:category" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
