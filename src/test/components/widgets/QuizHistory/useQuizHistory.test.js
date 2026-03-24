import { beforeEach, describe, test, expect, vi } from "vitest";
import { useQuizHistory } from "@/components/widgets/QuizHistory/useQuizHistory";

import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

import { act } from "@testing-library/react";

import quizProgressReducer, {
  progressInitialState,
} from "@/redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "@/redux/features/quizContent/quizContentSlice";

import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import quizHistoryReducer, {
  quizHistoryInitialState,
} from "@/redux/features/quizHistory/quizHistorySlice";

import snackbarReducer, {
  snackbarInitialState,
} from "@/redux/features/snackbar/snackbarSlice";
import authReducer, { authInitialState } from "@/redux/features/auth/authSlice";

import * as quizHistoryThunks from "@/redux/features/quizHistory/quizHistoryThunks";

describe("useQuizHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptinos = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
      quizHistory: quizHistoryReducer,
      snackbar: snackbarReducer,
      auth: authReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
      snackbar: { ...snackbarInitialState },
      quizHistory: { ...quizHistoryInitialState },
      auth: { ...authInitialState },
    },
  };

  describe("handleToggleSelectAll", () => {
    test("全選択状態の時に実行すると 選択されたidsは空になる", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.handleToggleSelectAll();
      });
      expect(result.current.selectedIds).toEqual([1, 2]);

      await act(async () => {
        result.current.handleToggleSelectAll();
      });

      expect(result.current.selectedIds).toEqual([]);
    });

    test("未選択 or 一部選択の時に実行すると すべてのhistoriesの idが選択される ", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.handleToggleSelectAll();
      });

      expect(result.current.selectedIds).toEqual([1, 2]);
    });
  });

  describe("handleSelect", () => {
    test("未選択のidを指定すると selectedIdsに追加される", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }],
          },
        },
      });

      await act(async () => {
        result.current.handleSelect(1);
      });

      expect(result.current.selectedIds).toEqual([1]);
    });

    test("選択済みのidを指定すると selectedIdsから削除される", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.handleSelect(1);
      });

      expect(result.current.selectedIds).toEqual([1]);

      await act(async () => {
        result.current.handleSelect(1);
      });

      expect(result.current.selectedIds).toEqual([]);
    });
  });

  describe("openDeleteModal", () => {
    test("idがある場合 targetIdを設定する", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.openDeleteModal(1);
      });

      expect(result.current.targetId).toBe(1);
      expect(result.current.modalTitle).toEqual("この記録を削除しますか?");
      expect(result.current.isModalOpen).toBe(true);
    });

    test("idがnullの場合 targetIdはnull modalTitleのみ設定される", async () => {
      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.openDeleteModal();
      });

      expect(result.current.targetId).toBe(null);
      expect(result.current.modalTitle).toEqual("選択した記録を削除しますか?");
      expect(result.current.isModalOpen).toBe(true);
    });
  });

  describe("handleSingleDelete", () => {
    test("deleteHistoryAsync が dispatchされ 各stateがリセットされる", async () => {
      const deleteSpy = vi.spyOn(quizHistoryThunks, "deleteHistoryAsync");

      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.openDeleteModal(1);
      });

      expect(result.current.targetId).toBe(1);

      await act(async () => {
        result.current.handleSingleDelete();
      });

      expect(deleteSpy).toHaveBeenCalledWith({ id: 1 });
      expect(result.current.modalTitle).toEqual("この記録を削除しますか?");
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.targetId).toBe(null);
    });
  });

  describe("handleBulkDelete", () => {
    test("deleteHistoriesAsync が dispatchされ 各stateがリセットされる", async () => {
      const bulkDeleteSpy = vi.spyOn(quizHistoryThunks, "deleteHistoriesAsync");

      const { result } = renderHookWithStore({
        hook: () => useQuizHistory(),
        ...commonOptinos,
        preloadedState: {
          ...commonOptinos.preloadedState,
          quizHistory: {
            ...quizHistoryInitialState,
            histories: [{ id: 1 }, { id: 2 }],
          },
        },
      });

      await act(async () => {
        result.current.handleToggleSelectAll();
      });

      expect(result.current.selectedIds).toEqual([1, 2]);

      await act(async () => {
        result.current.handleBulkDelete();
      });

      expect(bulkDeleteSpy).toHaveBeenCalledWith({
        ids: [1, 2],
      });
      expect(result.current.modalTitle).toEqual("選択した記録を削除しますか?");
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.targetId).toBe(null);
      expect(result.current.selectedIds).toEqual([]);
    });
  });
});
