//quizFixture.js

export const undecodedQuizList = [
  {
    type: "multiple",
    difficulty: "easy",
    category: "Entertainment: Film",
    question:
      "In Star Wars, what&#039;s the name of the new Government created after the defeat of the Galactic Empire?",
    correct_answer: "The New Republic",
    incorrect_answers: [
      "The Rebel Alliance",
      "The Crimson Dawn",
      "The First Order",
    ],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Art",
    question:
      "What is a fundamental element of the Gothic style of architecture?",
    correct_answer: "pointed arch",
    incorrect_answers: [
      "coffered ceilings",
      "fa&ccedil;ades surmounted by a pediment ",
      "internal frescoes",
    ],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Vehicles",
    question: "Jaguar Cars was previously owned by which car manfacturer?",
    correct_answer: "Ford",
    incorrect_answers: ["Chrysler", "General Motors", "Fiat"],
  },
];

export const decodedQuizList = [
  {
    // type: "multiple",
    difficulty: "easy",
    // category: "Entertainment: Film",
    question:
      "In Star Wars, what's the name of the new Government created after the defeat of the Galactic Empire?",
    correctAnswer: "The New Republic",
    incorrectAnswers: [
      "The Rebel Alliance",
      "The Crimson Dawn",
      "The First Order",
    ],
  },
  {
    // type: "multiple",
    difficulty: "easy",
    // category: "Art",
    question:
      "What is a fundamental element of the Gothic style of architecture?",
    correctAnswer: "pointed arch",
    incorrectAnswers: [
      "coffered ceilings",
      "façades surmounted by a pediment ",
      "internal frescoes",
    ],
  },
  {
    // type: "multiple",
    difficulty: "easy",
    // category: "Vehicles",
    question: "Jaguar Cars was previously owned by which car manfacturer?",
    correctAnswer: "Ford",
    incorrectAnswers: ["Chrysler", "General Motors", "Fiat"],
  },
];

export const mockState = {
  quizContent: {
    isLoading: false,
    quizzes: decodedQuizList,
    fetchError: null,
  },

  quizProgress: {
    currentIndex: 0,
    numberOfCorrects: 1,
    numberOfIncorrects: 0,
    userAnswers: [
      {
        question: decodedQuizList[0].question,
        correctAnswer: decodedQuizList[0].correctAnswer,
        selectedAnswer: decodedQuizList[0].correctAnswer,
        isCorrect: true,
        allAnswers: [
          decodedQuizList[0].correctAnswer,
          ...decodedQuizList[0].incorrectAnswers,
        ],
      },
    ],
  },
};
