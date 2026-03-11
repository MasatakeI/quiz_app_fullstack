/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  test: {
    globals: true, // expect などを global で使えるようにする
    environment: "jsdom", // ブラウザ環境をシミュレート
    setupFiles: ["./src/setupTests.js"], // 初期設定ファイルを指定
    coverage: {
      exclude: ["**/*.css", "**/node_modules/**"], // CSSを除外
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  coverage: {
    provider: "v8",
    reporter: ["text", "html", "json"],
    reportsDirectory: "./coverage",
    exclude: [
      "node_modules/",
      "src/test/",
      "**/*.test.*",
      "**/*.spec.*",
      "src/main.jsx",
      "**/*.css",
    ],
  },
});
