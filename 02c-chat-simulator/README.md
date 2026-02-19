# 02c-chat-simulator ― チャットシミュレーター

AI チャット風の UI シミュレーターです。ユーザーがメッセージを入力すると、定義済みの応答プールからランダムに選ばれた文章が1文字ずつストリーミング表示されます。バックエンドは不要で、全てフロントエンドで完結します。

## セットアップ

```bash
cd 02c-chat-simulator
npm install
npm run dev
```

## 学習の進め方

ソースコード内の `TODO(Q1)` 〜 `TODO(Q10)` を探して、空欄を埋めてください。
全ての空欄を正しく埋めると、`npm run dev` でアプリが動作します。

### TODO 一覧

| # | ファイル | テーマ |
|---|---------|--------|
| Q1 | `src/types.ts` | interface と type alias の定義 |
| Q2 | `src/types.ts` | 判別共用体（Discriminated Union） |
| Q3 | `src/hooks/useChat.ts` | useReducer の初期化 |
| Q4 | `src/hooks/useChat.ts` | setTimeout による疑似ストリーミング |
| Q5 | `src/hooks/useChat.ts` | useRef + useEffect で自動スクロール |
| Q6 | `src/hooks/useChat.ts` | useCallback によるメモ化 |
| Q7 | `src/components/ChatMessage.tsx` | 条件付きレンダリング |
| Q8 | `src/components/ChatInput.tsx` | useState + フォーム送信 |
| Q9 | `src/components/StreamingDots.tsx` | JSX と inline style |
| Q10 | `src/pages/ChatPage.tsx` | コンポーネントの組み立てとリスト描画 |

## 学べる React / TypeScript の概念

- **useReducer**: 複雑な状態管理を reducer パターンで実装
- **useRef + useEffect**: DOM 操作（自動スクロール）
- **useCallback**: コールバック関数のメモ化
- **判別共用体**: TypeScript の型安全な Action パターン
- **条件付きレンダリング**: `&&` 演算子による表示切り替え
- **リスト描画**: `map()` と `key` による効率的なリスト表示
- **フォーム管理**: 制御コンポーネントパターン
- **setTimeout 再帰**: 疑似ストリーミングの実装

## ファイル構成

```
src/
├── main.tsx              # エントリーポイント
├── App.tsx               # ルーター設定
├── App.css               # チャットバブルのスタイル
├── index.css             # グローバルスタイル（CSS変数）
├── types.ts              # 型定義（Q1, Q2）
├── data/
│   └── responses.ts      # AI 応答プール（20件）
├── hooks/
│   └── useChat.ts        # チャットロジック（Q3, Q4, Q5, Q6）
├── components/
│   ├── ChatMessage.tsx   # メッセージ表示（Q7）
│   ├── ChatInput.tsx     # 入力フォーム（Q8）
│   └── StreamingDots.tsx # ドットアニメーション（Q9）
└── pages/
    └── ChatPage.tsx      # チャット画面（Q10）
```

## 次のステップ

このアプリで学んだストリーミング表示の概念は、`02-mastra-rag` の実際の AI チャットアプリで活用されます。そちらでは本物の LLM API を使ったストリーミングレスポンスを実装します。
