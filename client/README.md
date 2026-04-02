# クイズアプリ（React / Redux Toolkit / Node.js / TypeScript）- Frontend (Client)

<p align="left">
  <img src="https://github.com/MasatakeI/quiz_app/actions/workflows/test.yml/badge.svg" alt="Vitest CI" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat&logo=typescript" alt="TypeScript" />
  <a href="https://quiz-app-zeta-pearl.vercel.app/">
    <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel" alt="Vercel Status" />
  </a>
</p>

## 概要

**Full-stack Evolution**  
Firebase BaaS 構成から、Node.js (Express) バックエンドを介した独自 API 構成へ進化。

フロントエンドの **TypeScript 全面移行** により、データ層から UI 層まで一貫した型安全性を実現。

Open Trivia Database API を活用した、カスタマイズ性の高い学習用 Web アプリケーション。  
**「実務レベルの堅牢性」** と **「フルスタックな型安全性」** をテーマに設計。

ライブデモ:

---

## 開発環境

| Layer            | Stack                          |
| :--------------- | :----------------------------- |
| Frontend         | React 18 / Vite / TypeScript   |
| Backend          | Node.js (Express) / TypeScript |
| State Management | Redux Toolkit / Redux Thunk    |
| Database         | Firebase (Firestore / Auth)    |
| Testing          | Vitest / React Testing Library |
| CI/CD / Hosting  | GitHub Actions / Vercel        |

---

## アーキテクチャと設計思想

フロントエンドから直接 BaaS を操作せず、自作 API サーバーを仲介することで、  
ビジネスロジックの秘匿化とセキュアなデータ操作を実現。

```mermaid
graph TD
    subgraph Client_Side [Frontend (React + TS)]
        UI[Components]
        Store[Redux Store]
        Fetcher[API Fetcher]
    end

    subgraph Server_Side [Backend (Node.js + TS)]
        API[Express API]
        Logic[Business Logic / Validation]
    end

    subgraph DB_Layer [Database]
        Fire[Firebase Admin SDK]
        FS[(Firestore)]
    end

    UI --> Store
    Store --> Fetcher
    Fetcher -- REST API --- API
    API --> Logic
    Logic --> Fire
    Fire --> FS

    style Client_Side fill:#e1f5fe,stroke:#01579b
    style Server_Side fill:#fff3e0,stroke:#e65100
    style DB_Layer fill:#f1f8e9,stroke:#33691e

```

## 技術的な挑戦とアップデート

### 1. フロントエンドの全面 TypeScript 移行

#### 課題

Firebase から返却される動的なデータ構造による、実行時エラーやタイポのリスク。

#### 解決策

- `RawQuizHistory`（API生データ）
- `QuizHistoryModel`（UI用整形データ）

を明確に分離し、型定義を設計。

- モデル層でのバリデーション実装
- `Omit` などのユーティリティ型活用

#### 結果

- コンパイル時にバグ検出（デバッグ時間削減）
- エディタ補完による開発効率向上

---

### 2. BaaS → 自作 API サーバー移行（Backend Proxy）

#### 課題

Firebase ロジックや Security Rules がフロントに露出する問題。

#### 解決策

- Node.js（Express）による中間 API サーバー構築
- Firebase Admin SDK をバックエンドに集約

#### 結果

- フロントエンドの軽量化
- セキュリティ強化
- DB変更（RDB等）への柔軟性確保

---

### 3. Branch Coverage 重視のテスト戦略

#### アップデート

- テストコードも TypeScript 化
- `vi.mock` の戻り値に型を付与

#### 効果

- モックデータの整合性をコンパイル時に保証
- テストが「仕様のセンサー」として機能

---

## テスト・品質指標

| カテゴリ       | 内容                          | 指標         |
| :------------- | :---------------------------- | :----------- |
| 型安全性       | TypeScript による静的解析     | Strict Mode  |
| ユニットテスト | Model / Redux（Logic・Thunk） | 100% Pass    |
| 統合テスト     | API連携 / UI操作              | 約85% Branch |

---

## 開発の始め方

### バックエンド起動

```bash
cd server
npm install
npm run dev
```

# http://localhost:5001

## フロントエンド起動

```bash
cd client
npm install
npm run dev
```

# http://localhost:5173

## 今後のロードマップ（Phase 3）

- [x] Node.js / TypeScript 化
- [ ] Shared Types（フロント・バック共通型）
- [ ] SQL Migration（PostgreSQL + Prisma）
- [ ] E2E Testing（Playwright）
- [ ] Performance 最適化（Code Splitting / RSC）

## 知見の深化

型はドキュメントであり、ガードレールである

TypeScript は単なる型チェックではなく、
システム仕様そのものをコードで表現する手段。

バックエンドを自作したことで、
エンドツーエンドのデータフローに責任を持つ重要性を学習。

```

```
