//src/components/widgets/QuizHistory/QuizHistory.jsx

import React from "react";
import "./QuizHistory.css";

import Button from "@/components/common/Button/Button";
import DeleteModal from "@/components/common/DeleteModal/DeleteModal";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { useQuizHistory } from "./useQuizHistory";
import QuizHistoryView from "./QuizHistoryView";
import CheckContainer from "./CheckContainer";

const QuizHistory = () => {
  const { handleGoHome, handleRetryFromHistory } = useNavigationHelper();

  const {
    histories,
    label,
    selectedIds,
    isModalOpen,
    setIsModalOpen,
    modalTitle,
    targetId,
    handleToggleSelectAll,
    openDeleteModal,
    handleSelect,
    handleBulkDelete,
    handleSingleDelete,
  } = useQuizHistory();

  if (histories.length === 0) {
    return (
      <div>
        <h1 className="title">クイズの記録</h1>
        <p>記録がありません クイズに回答後 記録してください</p>
        <Button onClickHandler={handleGoHome}>ホームへ戻る</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">クイズの記録</h1>
      <CheckContainer
        label={label}
        histories={histories}
        selectedIds={selectedIds}
        handleOnChange={handleToggleSelectAll}
        handleModalOpen={openDeleteModal}
      />

      <QuizHistoryView
        histories={histories}
        onRetry={handleRetryFromHistory}
        onDelete={openDeleteModal}
        onSelect={handleSelect}
        selectedIds={selectedIds}
      />

      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        onConfirm={targetId ? handleSingleDelete : handleBulkDelete}
        message={
          selectedIds.length > 0 ? `${selectedIds.length}件 を削除します` : ""
        }
        confirmTitle={"削除"}
      />
    </div>
  );
};

export default QuizHistory;
