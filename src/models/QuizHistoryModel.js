//src/models/QuizHistoryModel.js

import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  orderBy,
  doc,
} from "firebase/firestore";

import { QuizHistoryError } from "./errors/quizHistory/quizHistoryError";
import { quizHistoryRef } from "@/firebase";
import { QUIZ_HISTORY_ERROR_CODE } from "./errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "./errors/quizHistory/mapQuizHistoryError";

import { format } from "date-fns";

export const createHistory = (id, data) => {
  if (
    !data ||
    // typeof data.category !== "string" ||
    typeof data.difficulty !== "string" ||
    typeof data.score !== "number" ||
    typeof data.totalQuestions !== "number" ||
    typeof data.date?.toDate !== "function"
  ) {
    throw new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
      message: "無効なデータです",
    });
  }

  const dateObj = format(data.date.toDate(), "yyyy/MM/dd HH:mm");

  return {
    id,
    category: data.category,
    date: dateObj,
    difficulty: data.difficulty,
    type: data.type,
    score: data.score,
    totalQuestions: data.totalQuestions,
    accuracy:
      data.totalQuestions > 0
        ? Number((data.score / data.totalQuestions).toFixed(2))
        : 0,
  };
};

export const addHistory = async (resultData) => {
  try {
    if (!resultData.score || typeof resultData.score !== "number") {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
        message: "スコア情報が不足しています",
      });
    }

    // const { category, difficulty, score, totalQuestions } = resultData;
    const postData = {
      ...resultData,
      date: serverTimestamp(),
    };

    const docRef = await addDoc(quizHistoryRef, postData);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
        message: "クイズ結果の追加に失敗しました",
      });
    }

    const data = snapShot.data();

    const model = createHistory(docRef.id, data);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const fetchHistories = async () => {
  try {
    const q = query(quizHistoryRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return [];
    }

    return querySnapshot.docs.map((doc) => {
      return createHistory(doc.id, doc.data());
    });
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const deleteHistory = async (id) => {
  try {
    const docRef = doc(quizHistoryRef, id);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.NOT_FOUND,
        message: "削除対象のデータが見つかりませんでした",
      });
    }

    const data = snapShot.data();
    const model = createHistory(docRef.id, data);

    await deleteDoc(docRef);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};
