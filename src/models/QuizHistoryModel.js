//src/models/QuizHistoryModel.js

import {
  addDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  orderBy,
  doc,
  where,
  writeBatch,
} from "firebase/firestore";

import { quizHistoryRef, db } from "@/firebase";
import { QuizHistoryError } from "./errors/quizHistory/quizHistoryError";
import { QUIZ_HISTORY_ERROR_CODE } from "./errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "./errors/quizHistory/mapQuizHistoryError";

import { format } from "date-fns";

export const createHistory = (id, data) => {
  const isValid =
    data &&
    typeof data.difficulty === "string" &&
    typeof data.score === "number" &&
    typeof data.totalQuestions === "number" &&
    data.date; // 存在だけ確認（toDateの有無は後で判定）

  if (!isValid) {
    throw new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
      message: "無効なデータです",
    });
  }

  // 2. 日付の変換（Firebase Timestamp か 通常の Date/String かを判定）
  const timestamp =
    typeof data.date.toDate === "function"
      ? data.date.toDate()
      : new Date(data.date);
  const dateObj = format(timestamp, "yyyy/MM/dd HH:mm");

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

export const addHistory = async (userId, resultData) => {
  try {
    if (typeof resultData.score !== "number") {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
        message: "スコア情報が不足しています",
      });
    }

    const postData = {
      ...resultData,
      userId,
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

export const fetchHistories = async (userId) => {
  try {
    const q = query(
      quizHistoryRef,
      where("userId", "==", userId),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return [];
    }

    // fetchHistories 内
    return querySnapshot.docs.map((doc) => {
      return createHistory(doc.id, doc.data());
    });
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const performDelete = async (ids) => {
  if (!ids || ids.length === 0) return [];

  try {
    const batch = writeBatch(db);
    ids.forEach((id) => {
      const docRef = doc(quizHistoryRef, id);
      batch.delete(docRef);
    });
    await batch.commit();
    return ids;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const deleteHistory = (id) => performDelete([id]);
export const deleteHistories = (ids) => performDelete(ids);
