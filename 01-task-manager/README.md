# React + TypeScript 学習用タスク管理アプリ

React の全主要概念を、実際のタスク管理アプリを通じて学ぶコードリーディング教材です。

> **前提知識**: TypeScript の基礎（型、interface、ジェネリクスなど）を理解していることが前提です。
> TypeScript の基礎は [StudyTypescript リポジトリ](https://github.com/i-inose/StudyTypescript) で学べます。

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

---

## コードリーディング順序

**以下の順番で読むと、依存関係に沿って理解が進みます。**

### Step 1: プロジェクト設定を把握する

| # | ファイル | 学べること |
|---|---------|-----------|
| 1 | `package.json` | 依存パッケージ、スクリプトの構成 |
| 2 | `tsconfig.json` | TypeScript コンパイラ設定 |
| 3 | `vite.config.ts` | Vite（ビルドツール）の設定 |
| 4 | `index.html` | SPA のベース HTML。`<div id="root">` がアプリのマウント先 |

### Step 2: バックエンドを理解する（Python / FastAPI）

| # | ファイル | 学べること |
|---|---------|-----------|
| 5 | `server.py` | **FastAPI** による REST API サーバー。`GET` / `POST` / `PATCH` / `DELETE` の CRUD 操作、**Pydantic** によるバリデーション・スキーマ定義、**CORS** 設定、`HTTPException`、デコレータ (`@app.get` 等)、型ヒント (`Literal`, `Optional`)、インメモリデータストア |
| - | `requirements.txt` | Python の依存パッケージ一覧（`fastapi`, `uvicorn`, `pydantic`） |

### Step 3: 共有型と API 通信を理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 6 | `src/types.ts` | アプリ全体で共有する **型定義**。`type` / `interface` の使い分け、ジェネリクス `ApiResponse<T>` |
| 7 | `src/api.ts` | `fetch` API によるバックエンド通信。`async/await`、型付きレスポンス |

### Step 4: 状態管理の基盤を理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 8 | `src/reducers/taskReducer.ts` | **useReducer** のロジック。判別共用体（Discriminated Union）による Action 型、純粋関数としての Reducer |
| 9 | `src/contexts/ThemeContext.tsx` | **Context API** / **createContext** / **Provider パターン** / **useContext**。`localStorage` との連携、`useCallback` によるメモ化 |
| 10 | `src/hooks/useTasks.ts` | **カスタムフック**。`useReducer` + `useEffect` + `useCallback` の組み合わせ。ロジックと UI の分離 |

### Step 5: UI コンポーネントを理解する（小さい部品 → 大きい部品の順）

| # | ファイル | 学べること |
|---|---------|-----------|
| 11 | `src/components/TaskItem.tsx` | **React.memo** による再レンダリング最適化、**useCallback** でイベントハンドラをメモ化する理由、条件付きクラス名 |
| 12 | `src/components/TaskForm.tsx` | **useState** で入力値を管理する（制御コンポーネント）、**useRef** で DOM にアクセス、`FormEvent` / `ChangeEvent` の型 |
| 13 | `src/components/TaskList.tsx` | **useMemo** で計算結果をキャッシュ、`map` + **key** によるリスト描画、条件付きレンダリング（早期リターン） |
| 14 | `src/components/TaskStats.tsx` | **useMemo** で統計情報を算出、動的クラス名の切り替え |
| 15 | `src/components/Modal.tsx` | **createPortal** で DOM ツリー外にレンダリング、**useEffect のクリーンアップ**（イベントリスナー解除）、`stopPropagation` |
| 16 | `src/components/ErrorBoundary.tsx` | **Error Boundary**（クラスコンポーネント）、`getDerivedStateFromError` / `componentDidCatch` ライフサイクルメソッド |
| 17 | `src/components/Header.tsx` | **React Router の Link**（SPA 内遷移）、useContext でテーマを消費する側の実装 |
| 18 | `src/components/Layout.tsx` | **Fragment** で余分な DOM を作らない、**children** Props パターン |

### Step 6: ページとルーティングを理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 19 | `src/pages/HomePage.tsx` | カスタムフックを使った**ロジックと UI の分離**、複数コンポーネントの**コンポジション**、条件付きレンダリング（loading / error / data） |
| 20 | `src/pages/AboutPage.tsx` | **default export**（`React.lazy` に必要）。シンプルな表示専用コンポーネント |

### Step 7: アプリ全体の構成を理解する

| # | ファイル | 学べること |
|---|---------|-----------|
| 21 | `src/App.tsx` | **React Router** (`BrowserRouter`, `Routes`, `Route`)、**React.lazy + Suspense** によるコード分割、Provider の入れ子構造、Error Boundary のスコープ |
| 22 | `src/main.tsx` | **エントリーポイント**。`createRoot` / **StrictMode** / 非 null アサーション `!` |

### Step 8: スタイリングを確認する

| # | ファイル | 学べること |
|---|---------|-----------|
| 23 | `src/index.css` | CSS カスタムプロパティ（CSS 変数）、リセット CSS |
| 24 | `src/App.css` | **BEM 記法** (`block__element--modifier`)、レスポンシブ対応 (`@media`)、テーマ対応のスタイル設計 |
