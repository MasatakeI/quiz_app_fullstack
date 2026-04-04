//vite.config.js

/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  // すべてのテスト設定（カバレッジ含む）はこの中に記述します
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "json"],
      reportsDirectory: "./coverage",
      // 統計から除外するファイルをここに集約します
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "src/test/**", // テスト用ユーティリティ
        "**/*.test.*", // テストファイル本体
        "**/*.spec.*",
        "src/main.jsx", // エントリーポイント（レンダリングのみなので除外が一般的）
        "**/*.css", // スタイルファイル
        "vite.config.js", // 設定ファイル
        "eslint.config.js",
        ".github/**",
        "coverage2",
      ],
    },
    server: {
      deps: {
        inline: [/src/], // src 配下のファイルをインラインで処理させる
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
