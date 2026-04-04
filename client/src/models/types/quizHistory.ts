export interface RawQuizHistory {
  id: string;
  category: string;
  difficulty: string;
  type: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface QuizHistoryModel {
  id: string;
  category: string;
  date: string;
  difficulty: string;
  type: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}

export type QuizHistoryInput = Omit<RawQuizHistory, "id" | "date">;
