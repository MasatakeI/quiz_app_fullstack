# Quiz App Backend API

Node.js と Express を使用した、クイズアプリ専用のバックエンド API サーバーです。
TypeScript による厳格な型管理と Firebase Admin SDK を介したセキュアなデータ連携を実現しています。

---

## 🛠 技術スタック (Tech Stack)

- **Runtime**: Node.js (v18+)
- **Framework**: Express
- **Language**: **TypeScript** (ts-node-dev による高速な開発サイクル)
- **SDK**: Firebase Admin SDK
- **Formatter/Linter**: ESLint / Prettier

---

## API エンドポイント (Endpoints)

| メソッド | パス                     | 説明                                   |
| :------- | :----------------------- | :------------------------------------- |
| `GET`    | `/api/histories/:userId` | 指定ユーザーのクイズ履歴を最新順に取得 |
| `POST`   | `/api/histories`         | クイズ結果の新規保存                   |
| `DELETE` | `/api/histories`         | 指定された ID 配列による一括削除       |

### リクエスト / レスポンス例

#### `POST /api/histories`

**Request Body:**

```json
{
  "userId": "user123",
  "score": 8,
  "totalQuestions": 10,
  "category": "Science",
  "difficulty": "medium",
  "type": "multiple"
}

{
  "id": "generated-firestore-id",
  "userId": "user123",
  "score": 8,
  "totalQuestions": 10,
  "category": "Science",
  "difficulty": "medium",
  "type": "multiple",
  "date": "2026-04-02T05:00:00.000Z"
}
```

## 技術的判断の背景 (Technical Notes)

Firebase Admin SDK の採用: サーバーサイドから Firestore を操作することで、フロントエンドに特権を持たせないセキュアな設計を採用。

データ整合性の担保: 保存時にサーバー側で serverTimestamp() を付与。取得時はフロントエンドが扱いやすい ISO 8601 形式 に統一して返却。

CORS 設定: 開発用ポート（5173）を許可し、開発と本番で柔軟に切り替え可能な構造を構築。

## 開発の始め方

依存関係のインストール

```Bash
npm install
Firebase サービスアカウントの配置
Firebase コンソールから取得した サービスアカウントキー (service-account-file.json) を server/ 直下に配置してください。
```

[!IMPORTANT]
このファイルは Git にコミットしないでください（.gitignore 推奨）。

## サーバーの起動

Bash
npm run dev
