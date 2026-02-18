# 02 - Mastra RAG Document Q&A

Mastra v1 を使った RAG（Retrieval-Augmented Generation）ドキュメント Q&A アプリケーションです。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React 19 + TypeScript + Vite 7 + React Router 7 |
| バックエンド | Node.js + TypeScript + Hono |
| AI フレームワーク | Mastra v1 |
| LLM | Anthropic Claude (テキスト生成) |
| Embedding | OpenAI text-embedding-3-small |
| ベクトル DB | LibSQL (ファイルベース) |

## セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env を編集して API キーを設定

# 開発サーバーの起動（フロント + バックエンド同時）
npm run dev
```

## コードリーディングガイド

以下の順番で読むと、RAG アプリケーションの仕組みを体系的に理解できます。

### Step 1: 設定ファイル

| ファイル | 学べること |
|---------|-----------|
| `package.json` | 使用パッケージの全体像 |
| `tsconfig.json` | プロジェクト参照（フロント/バックエンド分離） |
| `.env.example` | 必要な API キー |

### Step 2: バックエンドコア（Mastra 設定）

| ファイル | 学べること |
|---------|-----------|
| `server/mastra/index.ts` | LibSQLVector ベクトルストアの初期化 |
| `server/mastra/tools/vector-query.ts` | ベクトル検索ツールの作成 |
| `server/mastra/agents/rag-agent.ts` | RAG エージェントの定義 |

### Step 3: バックエンドロジック

| ファイル | 学べること |
|---------|-----------|
| `server/lib/chunker.ts` | ドキュメント分割 + Embedding 生成 |
| `server/routes/documents.ts` | ドキュメント CRUD API |
| `server/routes/chat.ts` | SSE ストリーミングチャット API |
| `server/index.ts` | Hono サーバー起動 + ルーティング |

### Step 4: フロントエンド基盤

| ファイル | 学べること |
|---------|-----------|
| `src/types.ts` | 型定義（ChatMessage, Document, Source） |
| `src/api.ts` | API クライアント関数 |
| `src/hooks/useChat.ts` | SSE ストリーミング + useReducer |

### Step 5: フロントエンド UI

| ファイル | 学べること |
|---------|-----------|
| `src/components/Header.tsx` | NavLink によるナビゲーション |
| `src/components/ChatInput.tsx` | 制御コンポーネント |
| `src/components/ChatMessage.tsx` | 条件付きレンダリング |
| `src/components/SourceCard.tsx` | Props の型定義 |
| `src/components/DocumentUpload.tsx` | 非同期フォーム送信 |
| `src/components/DocumentList.tsx` | useEffect によるデータ取得 |

### Step 6: ページ & エントリーポイント

| ファイル | 学べること |
|---------|-----------|
| `src/pages/ChatPage.tsx` | カスタムフックの利用 |
| `src/pages/DocumentsPage.tsx` | 状態のリフトアップ |
| `src/App.tsx` | React Router 設定 |
| `src/main.tsx` | React 19 createRoot |

## RAG の処理フロー

### ドキュメントアップロード時
```
テキスト入力 → MDocument.fromText() → chunk() で分割
→ embedMany() で Embedding 生成 → LibSQL にベクトル保存
```

### 質問応答時
```
質問テキスト → RAG Agent → vectorQueryTool で類似チャンク検索
→ 関連チャンクをコンテキストとして LLM に渡す → 回答生成（ストリーミング）
```

## ファイル構成

```
02-mastra-rag/
├── server/                    # バックエンド
│   ├── index.ts               # Hono HTTP サーバー
│   ├── mastra/
│   │   ├── index.ts           # ベクトルストア初期化
│   │   ├── agents/
│   │   │   └── rag-agent.ts   # RAG エージェント
│   │   └── tools/
│   │       └── vector-query.ts # ベクトル検索ツール
│   ├── routes/
│   │   ├── documents.ts       # ドキュメント API
│   │   └── chat.ts            # チャット API (SSE)
│   └── lib/
│       └── chunker.ts         # チャンク分割 + Embedding
├── src/                       # フロントエンド
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentList.tsx
│   │   └── SourceCard.tsx
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   └── DocumentsPage.tsx
│   ├── hooks/
│   │   └── useChat.ts
│   ├── types.ts
│   ├── api.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```
