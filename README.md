# React + TypeScript コードリーディング教材集

5つの実践的なアプリケーションを通じて、React・TypeScript・バックエンド技術を段階的に学ぶコードリーディング教材です。

> **前提知識**: TypeScript の基礎（型、interface、ジェネリクスなど）を理解していることが前提です。
> TypeScript の基礎は [StudyTypescript リポジトリ](https://github.com/i-inose/StudyTypescript) で学べます。

---

## 全体マップ

```
reactReading/
├── 01-task-manager/     タスク管理アプリ（React 基礎）
├── 02-mastra-rag/       AI ドキュメント Q&A（Mastra + RAG）
├── 03-auth-blog/        認証付きブログ（JWT + SQLAlchemy）
├── 04-realtime-chat/    リアルタイムチャット（WebSocket）
└── 05-api-design/       商品管理 API（REST 設計パターン）
```

---

## 推奨学習順序

| 順番 | アプリ | 難易度 | 主な学習テーマ |
|:---:|--------|:---:|--------------|
| 1 | [01-task-manager](./01-task-manager/) | ★☆☆ | React の全主要概念（useState, useReducer, Context, Router 等） |
| 2 | [05-api-design](./05-api-design/) | ★★☆ | REST API 設計パターン（ページネーション、フィルタ、ソート） |
| 3 | [03-auth-blog](./03-auth-blog/) | ★★☆ | JWT 認証フロー、ORM、保護されたルート |
| 4 | [04-realtime-chat](./04-realtime-chat/) | ★★★ | WebSocket、リアルタイム通信、イベント駆動設計 |
| 5 | [02-mastra-rag](./02-mastra-rag/) | ★★★ | AI/RAG パイプライン、ベクトル検索、SSE ストリーミング |

> 01 → 05 → 03 → 04 → 02 の順が推奨です。
> 01 で React の基礎を固めた後、バックエンド技術を段階的に深めていきます。

---

## 各アプリの概要

### 01-task-manager — タスク管理アプリ

**技術スタック**: React + TypeScript / FastAPI (Python)

React の全主要概念を、タスク管理アプリを通じて学びます。最初に取り組むべきアプリです。

**学べること**:
- useState, useReducer, useEffect, useCallback, useMemo, useRef
- Context API（テーマ切り替え）
- React Router（SPA ルーティング）
- React.memo / React.lazy + Suspense
- Error Boundary（クラスコンポーネント）
- createPortal（モーダル）

---

### 02-mastra-rag — AI ドキュメント Q&A

**技術スタック**: React + TypeScript / Mastra v1 + Hono (TypeScript)

テキスト文書をアップロードし、AI が RAG（Retrieval-Augmented Generation）で文書内容に基づいた回答を返す Q&A アプリです。

**学べること**:
- RAG パイプライン（チャンキング → 埋め込み → ベクトル検索 → 生成）
- Mastra Agent + Tools の設計
- ベクトルデータベース（LibSQL）
- SSE（Server-Sent Events）によるストリーミング
- ドラッグ＆ドロップによるファイルアップロード
- チャット UI パターン

**必要な API キー**: `OPENAI_API_KEY`（埋め込み用）, `ANTHROPIC_API_KEY`（LLM 用）

---

### 03-auth-blog — JWT 認証付きブログ

**技術スタック**: React + TypeScript / FastAPI + SQLAlchemy + SQLite (Python)

ユーザー登録・ログイン機能付きのブログプラットフォームです。認証フローの実装を学びます。

**学べること**:
- JWT 認証（アクセストークン + リフレッシュトークン）
- パスワードハッシュ化（bcrypt）
- 認証ミドルウェア（FastAPI Depends）
- ORM パターン（SQLAlchemy）
- 認証コンテキスト（AuthContext + useAuth）
- 保護されたルート（ProtectedRoute）
- axios interceptor によるトークン自動付与

---

### 04-realtime-chat — リアルタイムチャット

**技術スタック**: React + TypeScript / FastAPI + WebSocket (Python)

WebSocket を使ったリアルタイムチャットルームです。複数ルーム対応、オンラインユーザー表示付き。

**学べること**:
- WebSocket プロトコル（接続、送受信、切断）
- ConnectionManager パターン
- ルーム単位のブロードキャスト
- 判別共用体（Discriminated Union）によるメッセージ型
- 入力中インジケーター（デバウンス）
- useRef によるスクロール制御

---

### 05-api-design — REST API 設計パターン（商品管理）

**技術スタック**: React + TypeScript / FastAPI + SQLAlchemy + SQLite (Python)

商品管理システムを通じて、本格的な REST API 設計パターンを学びます。

**学べること**:
- ページネーション（offset/limit + 総件数）
- フィルタリング（クエリパラメータによる動的フィルタ）
- ソート（複数カラム、昇順/降順）
- バックグラウンドタスク（FastAPI BackgroundTasks）
- 検索デバウンス（useDebounce）
- ジェネリック型の活用（PaginatedResponse\<T\>）

---

## セットアップ

各アプリのディレクトリ内に `README.md` があり、詳しいセットアップ手順が記載されています。

### 共通の前提条件

- **Node.js** 18 以上
- **Python** 3.10 以上（02-mastra-rag 以外のバックエンド）
- **npm** または **yarn**

### 基本的な起動手順

```bash
# 各アプリのディレクトリに移動
cd 01-task-manager  # (例)

# フロントエンド依存パッケージのインストール
npm install

# バックエンド依存パッケージのインストール（Python アプリの場合）
pip install -r requirements.txt

# バックエンド起動（ターミナル 1）
python server.py          # Python アプリの場合
# または
npm run dev               # 02-mastra-rag は npm run dev で両方起動

# フロントエンド起動（ターミナル 2）
npm run dev               # Python アプリの場合
```

---

## コメントスタイル

全アプリ共通で、コードリーディング用の日本語教育コメントが付いています。

- **ファイルヘッダー**: `【このファイルで学べること】` で各ファイルの概要を説明
- **セクション区切り**: `// ----` で論理ブロックを区切り
- **概念説明**: `【○○とは？】` で初出の概念を解説
- **インライン**: 要点を簡潔に（書きすぎず、わかりやすく）

---

## 関連リポジトリ

- [StudyTypescript](https://github.com/i-inose/StudyTypescript) — TypeScript 基礎（この教材集の前提知識）
