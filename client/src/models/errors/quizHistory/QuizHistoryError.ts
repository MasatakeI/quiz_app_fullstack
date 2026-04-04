// src/models/errors/quizHistory/QuizHistoryError.ts

import { QUIZ_HISTORY_ERROR_CODE } from "./quizHistoryErrorCode";
import { ModelError, ModelErrorParams } from "../ModelError";

/**
 * QuizHistory 特有のパラメータ定義
 * ModelErrorParams を拡張して field を追加
 */
export interface QuizHistoryErrorParams extends ModelErrorParams {
  field?: string;
}

export class QuizHistoryError extends ModelError {
  public readonly field?: string;

  constructor(params: QuizHistoryErrorParams) {
    // 1. 引数から必要な値を取り出す
    const { code, message, cause, field } = params;

    // 2. コードが定義済みのものかチェックし、なければ UNKNOWN に倒す
    const codes = Object.values(QUIZ_HISTORY_ERROR_CODE) as string[];
    const resolvedCode = codes.includes(code)
      ? code
      : QUIZ_HISTORY_ERROR_CODE.UNKNOWN;

    // 3. 親クラス (ModelError) のコンストラクタを呼び出す
    super({
      code: resolvedCode,
      message,
      cause,
    });

    // 4. 独自のプロパティをセット
    this.field = field;

    // instanceof 判定を正しく動作させるためのボイラープレート
    Object.setPrototypeOf(this, QuizHistoryError.prototype);
  }
}
