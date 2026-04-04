// src/test/models/__fixtures__/buildHistory.ts

import { format } from "date-fns";
import { RawQuizHistory } from "@/models/types/quizHistory";

export interface MockHistory extends RawQuizHistory {
  iso: string;
  expectedDate: string;
  accuracy: number;
}

interface BuildHistoryInput extends Omit<
  MockHistory,
  "id" | "date" | "expectedDate"
> {
  id: string;
}

export const buildHistory = (input: BuildHistoryInput): MockHistory => {
  const {
    id,
    category,
    iso,
    difficulty,
    score,
    totalQuestions,
    accuracy,
    type,
  } = input;

  return {
    id,
    category,
    date: new Date(iso).toISOString(),
    iso,
    expectedDate: format(new Date(iso), "yyyy/MM/dd HH:mm"),
    difficulty,
    score,
    totalQuestions,
    accuracy,
    type,
  };
};
