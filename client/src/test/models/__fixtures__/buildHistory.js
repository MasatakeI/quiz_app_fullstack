// src/test/models/__fixtures__/buildHistory.js

import { format } from "date-fns";

export const buildHistory = ({
  id,
  category,
  iso,
  difficulty,
  score,
  totalQuestions,
  accuracy,
  type,
}) => {
  const date = new Date(iso);

  return {
    id,
    category,
    date: {
      toDate: () => date,
    },
    expectedDate: format(date, "yyyy/MM/dd HH:mm"),

    difficulty,
    score,
    totalQuestions,
    accuracy,
    type,
  };
};
