import React from "react";

import "./QuizHistoryItem.css";
import IconButton from "@/components/common/IconButton/IconButton";
import Checkbox from "@mui/material/Checkbox";
import { faRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DIFFICULTY_LABELS, TYPE_LABELS } from "@/constants/quizTranslations";
import { QUIZ_TITLE_MAP } from "@/constants/quizCategories";

const QuizHistoryItem = ({
  historyDate = "",
  historyCategory = "general", // デフォルト値を設定
  historyType = "multiple",
  historyScore = 0,
  historyTotalQuestions = 0,
  historyAccuracy = 0,
  historyDifficulty = "easy",

  id,
  isSelected,
  onSelect = () => {},
  onDelete = () => {},
  onRetry = () => {},
}) => {
  const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

  return (
    <div className="history-card">
      <div className="history-header">
        <Checkbox
          {...label}
          checked={isSelected}
          onChange={() => onSelect(id)}
        />
        <span className="history-date">{historyDate}</span>
        <div>
          <IconButton
            title="同じ条件で再挑戦"
            onClick={onRetry}
            icon={faRotateLeft}
          />
          <IconButton
            title="削除"
            onClick={onDelete}
            icon={faTrash}
            isDelete={true}
          />
        </div>
      </div>

      <span className="history-label">CONDITIONS</span>
      <div className="history-conditions">
        <span className="history-category">
          {QUIZ_TITLE_MAP[historyCategory]}
        </span>{" "}
        <span className="history-difficulty">{TYPE_LABELS[historyType]}</span>
        <span className="history-difficulty">
          {DIFFICULTY_LABELS[historyDifficulty]}
        </span>
        <span className="history-difficulty">{historyTotalQuestions}問</span>
      </div>

      <div className="history-stats">
        <div className="history-stat-item">
          <span className="history-label">Score</span>
          <span className="history-value">{historyScore}</span>
        </div>
        <div className="history-stat-item">
          <span className="history-label">Accuracy</span>
          <span className="history-value history-accuracy-highlight">
            {Math.round(historyAccuracy * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizHistoryItem;
