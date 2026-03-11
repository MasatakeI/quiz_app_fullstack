import React from "react";
import "./QuizResultView.css";

const QuizResultView = ({
  quizTitle,
  numberOfCorrects,
  amount,
  numberOfIncorrects,
  getType,
  currentDifficulty,
}) => {
  // 正解率の計算
  const accuracy =
    amount > 0 ? Math.round((numberOfCorrects / amount) * 100) : 0;

  // 正解率に応じた色の判定（80%以上は成功、50%以下は注意など）
  const getStatusClass = () => {
    if (accuracy >= 80) return "status-excellent";
    if (accuracy >= 50) return "status-good";
    return "status-poor";
  };

  return (
    <div className="quiz-result-view">
      <header className="result-header">
        <h1 className="result-title">{quizTitle}クイズ 結果</h1>

        {/* CSS変数 --accuracy を渡すことで、サークルの描画を制御 */}
        <div
          className={`accuracy-circle ${getStatusClass()}`}
          style={{ "--accuracy": `${accuracy}%` }}
        >
          <div className="inner-circle">
            <span className="accuracy-value">{accuracy}%</span>
            <span className="accuracy-label">Accuracy</span>
          </div>
        </div>
      </header>

      {/* 以下の統計情報やバッジは前回と同じ */}
      <div className="result-main-stats">
        <div className="stat-card correct">
          <span className="stat-label">正解</span>
          <span className="stat-number">{numberOfCorrects}</span>
        </div>
        <div className="stat-card incorrect">
          <span className="stat-label">誤答</span>
          <span className="stat-number">{numberOfIncorrects}</span>
        </div>
      </div>

      <div className="result-view-conditions">
        <span className="condition-badge">Total: {amount}</span>
        <span className="condition-badge difficulty">
          Level: {currentDifficulty}
        </span>
        <span className="condition-badge type">Type: {getType}</span>
      </div>
    </div>
  );
};

export default QuizResultView;
