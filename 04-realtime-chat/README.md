# React + TypeScript 学習用リアルタイムチャットアプリ

WebSocket を使ったリアルタイムチャットアプリを通じて、React の高度な概念を学ぶコードリーディング教材です。

> **前提知識**: React の基礎（useState, useEffect, コンポーネント等）を理解していることが前提です。
> 基礎は [01-task-manager](../01-task-manager/) で学べます。

---

## セットアップ

```bash
# フロントエンド
npm install

# バックエンド（Python）
pip install -r requirements.txt
```

## 起動方法

```bash
# バックエンド起動（ターミナル 1）
python server.py

# フロントエンド起動（ターミナル 2）
npm run dev
```

ブラウザを2つ開いて `http://localhost:5173` にアクセスすると、リアルタイムチャットを体験できます。

---

## コードリーディング順序

**以下の順番で読むと、依存関係に沿って理解が進みます。**

### Step 1: プロジェクト設定を把握する

| # | ファイル | 学べること |
|---|---------|-----------|
| 1 | `package.json` | 依存パッケージ、スクリプトの構成 |
| 2 | `tsconfig.json` | TypeScript コンパイラ設定（プロジェクト参照） |
| 3 | `vite.config.ts` | Vite の設定、**WebSocket プロキシ**の設定方法 |
| 4 | `index.html` | SPA のベース HTML |

### Step 2: バックエンドを理解する（Python / FastAPI + WebSocket）

| # | ファイル | 学べること |
|---|---------|-----------|
| 5 | `server.py` | **WebSocket プロトコル**の基礎（接続ライフサイクル）、**ConnectionManager パターン**（接続の一元管理）、**ブロードキャスト**（ルーム内一斉送信）、JSON メッセージプロトコル、**asyncio** による非同期処理、切断エラーのハンドリング |
| - | `requirements.txt` | Python の依存パッケージ一覧 |

### Step 3: 共有型定義を理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 6 | `src/types.ts` | **判別共用体（Discriminated Union）**によるメッセージ型設計、クライアント⇔サーバー間の通信プロトコル定義、リテラル型によるルーム名の制限 |

### Step 4: カスタムフックを理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 7 | `src/hooks/useWebSocket.ts` | **WebSocket ライフサイクル管理**（接続・切断・再接続）、**useRef** でインスタンスを保持する理由、**useEffect のクリーンアップ**でリソースを解放、自動再接続ロジック |
| 8 | `src/hooks/useChat.ts` | **useReducer** で複雑な状態を管理、**デバウンス**を使った入力中通知、複数のカスタムフックを組み合わせるパターン、**判別共用体の Type Narrowing** |

### Step 5: UI コンポーネントを理解する（小さい部品 → 大きい部品の順）

| # | ファイル | 学べること |
|---|---------|-----------|
| 9 | `src/components/MessageBubble.tsx` | **React.memo** による再レンダリング最適化、条件付きクラス名で送信者別の表示を切り替え |
| 10 | `src/components/MessageInput.tsx` | **制御コンポーネント**（useState で入力値管理）、**useRef** で DOM にフォーカス、**FormEvent / KeyboardEvent** の型 |
| 11 | `src/components/MessageList.tsx` | **useRef + useEffect** でメッセージの自動スクロール、**map + key** によるリスト描画 |
| 12 | `src/components/TypingIndicator.tsx` | **条件付きレンダリング（早期リターン）**、CSS アニメーションとの連携 |
| 13 | `src/components/UserList.tsx` | シンプルなリスト表示、接続状態インジケーター |
| 14 | `src/components/RoomSelector.tsx` | 定数配列からのタブ UI 動的生成、アクティブ状態の管理 |
| 15 | `src/components/JoinForm.tsx` | フォームのバリデーション、初回フォーカスの制御 |

### Step 6: ページとルーティングを理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 16 | `src/pages/JoinPage.tsx` | **useNavigate** によるプログラマティックな画面遷移 |
| 17 | `src/pages/ChatPage.tsx` | 複数コンポーネントの**コンポジション**、**ReturnType<typeof fn>** ユーティリティ型、未認証ユーザーのリダイレクト |

### Step 7: アプリ全体の構成を理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 18 | `src/App.tsx` | **React Router** の基本設定、**状態のリフトアップ**（カスタムフックの状態を子ページに配信） |
| 19 | `src/main.tsx` | **エントリーポイント**、`createRoot` / `StrictMode` |

### Step 8: スタイリングを確認する

| # | ファイル | 学べること |
|---|---------|-----------|
| 20 | `src/index.css` | CSS カスタムプロパティ、**prefers-color-scheme** によるダークモード自動対応、リセット CSS |
| 21 | `src/App.css` | **BEM 記法**、**@keyframes** アニメーション、レスポンシブ対応 |
