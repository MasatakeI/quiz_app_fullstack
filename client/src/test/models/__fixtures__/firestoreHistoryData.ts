// /src/test/models/__fixtures__/firestoreHistoryData.ts
import { buildHistory, MockHistory } from "./buildHistory";
import { QuizHistoryInput, RawQuizHistory } from "@/models/types/quizHistory";

export const newHistory: MockHistory = buildHistory({
  id: "mock-id-4",
  category: "sports",
  iso: "2026-04-01T22:00:00",
  difficulty: "easy",
  score: 3,
  totalQuestions: 10,
  accuracy: 0.3,
  type: "multiple",
});

export const validRawHistoryData = {
  id: "mock-id-4",
  category: "sports",
  date: "2026-04-01T22:00:00",
  difficulty: "easy",
  score: 3,
  totalQuestions: 10,
  type: "multiple",
};

export const newHistoryInput: QuizHistoryInput = {
  category: validRawHistoryData.category,
  difficulty: validRawHistoryData.difficulty,
  score: validRawHistoryData.score,
  totalQuestions: validRawHistoryData.totalQuestions,
  type: validRawHistoryData.type,
};
