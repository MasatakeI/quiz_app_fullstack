///src/test/models/__fixtures__/firestoreHistoryData.js

import { buildHistory } from "./buildHistory";

export const newHistory = buildHistory({
  id: "mock-id-4",
  category: "sports",
  iso: "2026-04-01T22:00:00",
  difficulty: "easy",
  score: 3,
  totalQuestions: 10,
  accuracy: 0.3,
  type: "multiple",
});

export const newHistoryInput = {
  category: newHistory.category,
  difficulty: newHistory.difficulty,
  score: newHistory.score,
  totalQuestions: newHistory.totalQuestions,
  accuracy: newHistory.accuracy,
  type: newHistory.type,
};
