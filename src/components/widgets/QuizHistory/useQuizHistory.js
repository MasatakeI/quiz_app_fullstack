import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectAllHistories } from "@/redux/features/quizHistory/quizHistorySelector";
import {
  deleteHistoriesAsync,
  deleteHistoryAsync,
} from "@/redux/features/quizHistory/quizHistoryThunks";

export const useQuizHistory = () => {
  const dispatch = useDispatch();

  const histories = useSelector(selectAllHistories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [targetId, setTargetId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === histories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(histories.map((h) => h.id));
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openDeleteModal = (id = null) => {
    if (id) {
      setTargetId(id);
      setModalTitle("この記録を削除しますか?");
    } else {
      setTargetId(null);
      setModalTitle("選択した記録を削除しますか?");
    }

    setIsModalOpen(true);
  };

  const handleSingleDelete = async () => {
    dispatch(deleteHistoryAsync({ id: targetId }));
    setModalTitle("この記録を削除しますか?");
    setIsModalOpen(false);
    setTargetId(null);
  };

  const handleBulkDelete = async () => {
    dispatch(deleteHistoriesAsync({ ids: selectedIds }));
    setIsModalOpen(false);
    setModalTitle("選択した記録を削除しますか?");
    setSelectedIds([]);
    setTargetId(null);
  };

  const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

  return {
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
  };
};
