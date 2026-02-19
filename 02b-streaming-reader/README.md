# 02b-streaming-reader: AI 読書ノート

テキストを入力すると、模擬 AI がストリーミングで要約を生成する学習用アプリです。
バックエンドは不要で、`setTimeout` チェーンによるストリーミング模擬を使います。

## 起動方法

```bash
npm install
npm run dev
```

## 02-mastra-rag との比較表

| パターン | 02-mastra-rag | 02b-streaming-reader |
|---------|---------------|---------------------|
| **ストリーミング** | ReadableStream + SSE パース | setTimeout チェーン（30-50ms/文字） |
| **useReducer** | ChatAction（メッセージの追加・追記） | EntryAction（エントリーの追加・チャンク追記・完了・削除） |
| **useRef** | bottomRef でチャット末尾にスクロール | streamEndRef でストリーミング末尾にスクロール |
| **ファイル入力** | DocumentUpload → サーバーにテキスト送信 | FileReader API で .txt をクライアント側で読み込み |
| **データ永続化** | バックエンド (LibSQL + Embedding) | localStorage |
| **条件付きレンダリング** | isLoading で「応答中...」表示 | StreamStatus (idle/streaming/done) で UI 切り替え |
| **useCallback** | send, clear のメモ化 | summarize, deleteEntry のメモ化 |
| **ルーティング** | Chat / Documents（2ページ） | Reader / History（2ページ） |
| **レイアウト** | Header を直接配置 | Layout + Outlet パターン |

## ファイル構成

```
src/
├── types.ts                  # 型定義（ReadingEntry, EntryAction, StreamStatus）
├── data/
│   └── summaryTemplates.ts   # 模擬 AI の要約テンプレート（15種）
├── hooks/
│   └── useReader.ts          # コアロジック（useReducer + setTimeout ストリーミング）
├── components/
│   ├── TextInput.tsx          # テキスト入力 + ファイル読み込み
│   ├── StreamingText.tsx      # ストリーミング表示（カーソル点滅付き）
│   ├── EntryCard.tsx          # 履歴エントリーカード
│   ├── Header.tsx             # ナビゲーション
│   └── Layout.tsx             # 共通レイアウト（Header + Outlet）
├── pages/
│   ├── ReaderPage.tsx         # メインページ
│   └── HistoryPage.tsx        # 履歴ページ
├── App.tsx                    # ルーター設定
├── main.tsx                   # エントリーポイント
├── index.css                  # グローバルスタイル
└── App.css                    # コンポーネントスタイル
```

## 学べる React パターン

1. **useReducer** — 複数アクションによる状態管理（Discriminated Union パターン）
2. **ストリーミング表示** — setTimeout チェーンで 1 文字ずつ表示
3. **useRef + scrollIntoView** — ストリーミング中の自動スクロール
4. **FileReader API** — クライアント側でのファイル読み込み
5. **条件付きレンダリング** — idle / streaming / done の 3 状態
6. **useCallback** — 不要な再レンダリングを防ぐ関数メモ化
7. **React Router** — Layout + Outlet による入れ子ルーティング
