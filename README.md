# Quiz App Fullstack (WIP 🚧)

Firebase を活用したクイズアプリをベースに、自前バックエンド（Node.js / Express）への移行とフルスタック化を目指す開発プロジェクトです。

## 概要

本プロジェクトは、以下のフロントエンド・プロジェクトをベースに、アーキテクチャのさらなる堅牢化とスケーラビリティを追求することを目的としています。

- **ベースプロジェクト (Frontend v1.0.0)**: [リンク：元のリポジトリURL]
- **現在のステータス**: フロントエンドの移行完了 / バックエンド基盤構築中

## 技術スタック（予定）

- **Frontend**: React, Redux Toolkit, Vitest (existing)
- **Backend**: Node.js, Express, Firebase Admin SDK
- **Database**: Firestore / PostgreSQL (Planned)
- **Infrastructure**: Vercel (Frontend), Render/Railway (Backend)

## プロジェクト構造

```text
.
├── client/   # React Frontend (Firebase SDK implementation)
└── server/   # Node.js Backend (Express API implementation)
```
