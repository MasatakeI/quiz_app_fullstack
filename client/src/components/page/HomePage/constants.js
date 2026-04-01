// Home/constants.js
import { CATEGORY_MAP, getQuizTitle } from "../../../constants/quizCategories";

export const getCategories = () =>
  Object.keys(CATEGORY_MAP).map((category) => {
    return {
      id: category,
      value: category,
      title: getQuizTitle(category),
    };
  });

export const types = [
  { id: 1, value: "boolean", title: "2択" },
  { id: 2, value: "multiple", title: "4択" },
];

export const getDifficulties = (type) =>
  type === "boolean"
    ? [
        { id: 1, value: "easy", title: "かんたん" },
        { id: 2, value: "medium", title: "ふつう" },
      ]
    : [
        { id: 1, value: "easy", title: "かんたん" },
        { id: 2, value: "medium", title: "ふつう" },
        { id: 3, value: "hard", title: "むずかしい" },
      ];

export const getAmounts = (type) =>
  type === "boolean"
    ? [{ id: 1, value: 5, title: "5問(2択専用)" }]
    : [
        { id: 1, value: 10, title: "10問" },
        { id: 2, value: 20, title: "20問" },
        { id: 3, value: 30, title: "30問" },
      ];
