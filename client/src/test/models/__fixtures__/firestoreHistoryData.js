///src/test/models/__fixtures__/firestoreHistoryData.js

import { buildHistory } from "./buildHistory";

export const newHistory = buildHistory({
  id: "mock-id-4",
  category: "sports",
  iso: "2020-01-04T12:00:00",
  difficulty: "easy",
  score: 3,
  totalQuestions: 10,
  accuracy: 0.3,
});

export const newHistoryInput = {
  category: newHistory.category,
  difficulty: newHistory.difficulty,
  score: newHistory.score,
  totalQuestions: newHistory.totalQuestions,
  accuracy: newHistory.accuracy,
};
