import React, { useLayoutEffect, useState } from "react";

import { vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Router } from "react-router";
import { renderHook } from "@testing-library/react";
import { createMemoryHistory } from "history";

export const renderHookWithStore = ({
  hook,
  reducers,
  preloadedState,
  initialPath = "/", // デフォルトをルートに
}) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  const dispatchSpy = vi.spyOn(store, "dispatch");

  // history.js などの外部依存を減らし、MemoryRouter のコンテキストを模倣
  const history = createMemoryHistory({
    initialEntries: [initialPath],
  });

  const wrapper = ({ children }) => {
    // 状態管理のための簡易Router（HistoryRouterの代わり）
    const [state, setState] = useState({
      action: history.action,
      location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
      <Provider store={store}>
        <Router
          location={state.location}
          navigationType={state.action}
          navigator={history}
        >
          {children}
        </Router>
      </Provider>
    );
  };

  // renderHook の戻り値を明示的に受け取る
  const renderResult = renderHook(() => hook(), { wrapper });

  return {
    result: renderResult.result,
    unmount: renderResult.unmount,
    rerender: renderResult.rerender,
    store,
    dispatchSpy,
  };
};
