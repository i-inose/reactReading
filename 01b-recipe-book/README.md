# レシピブック --- React + TypeScript 2nd Reading アプリ

01-task-manager で学んだ React パターンを、別のドメイン（レシピ管理）で復習するための 2nd Reading 教材です。
コメントは「ここだけは覚えておきたい」ポイントに絞っています（01 の約半分）。

---

## セットアップ

```bash
npm install
npm run dev
```

バックエンドは不要です（localStorage のみでデータを永続化します）。

---

## コードリーディング順序

### Step 1: プロジェクト設定

| # | ファイル | 学べること |
|---|---------|-----------|
| 1 | `package.json` | 依存パッケージ、スクリプトの構成 |
| 2 | `tsconfig.json` | TypeScript コンパイラ設定 |
| 3 | `vite.config.ts` | Vite ビルドツールの設定 |
| 4 | `index.html` | SPA のベース HTML |

### Step 2: 型定義とデータ

| # | ファイル | 学べること |
|---|---------|-----------|
| 5 | `src/types.ts` | Recipe, Category, Ingredient の型定義、判別共用体の Action 型 |
| 6 | `src/data/initialRecipes.ts` | 初期データの切り出しパターン |

### Step 3: 状態管理の基盤

| # | ファイル | 学べること |
|---|---------|-----------|
| 7 | `src/reducers/recipeReducer.ts` | **useReducer** のリデューサー関数、イミュータブルな状態更新 |
| 8 | `src/contexts/UnitContext.tsx` | **Context API** + **Provider パターン**。単位系の切替（ThemeContext と対比） |
| 9 | `src/hooks/useRecipes.ts` | **カスタムフック**: useReducer + useEffect(localStorage) + useCallback |

### Step 4: UI コンポーネント（小 → 大）

| # | ファイル | 学べること |
|---|---------|-----------|
| 10 | `src/components/RecipeCard.tsx` | **React.memo** で再レンダリング最適化 |
| 11 | `src/components/RecipeForm.tsx` | **useState** + **useRef**(自動フォーカス) + 動的フォーム |
| 12 | `src/components/RecipeList.tsx` | map + **key** によるリスト描画 |
| 13 | `src/components/RecipeStats.tsx` | **useMemo** でカロリー平均・カテゴリ別集計を計算 |
| 14 | `src/components/Modal.tsx` | **createPortal** + useEffect クリーンアップ |
| 15 | `src/components/ErrorBoundary.tsx` | **Error Boundary**（クラスコンポーネント） |
| 16 | `src/components/Header.tsx` | **React Router の Link** + Context 消費側 |
| 17 | `src/components/Layout.tsx` | **Outlet** (React Router v7) によるレイアウト |

### Step 5: ページとルーティング

| # | ファイル | 学べること |
|---|---------|-----------|
| 18 | `src/pages/HomePage.tsx` | カスタムフックでロジックと UI を分離、モーダル制御 |
| 19 | `src/pages/FavoritesPage.tsx` | **React.lazy** で遅延読み込みされるページ |
| 20 | `src/pages/AboutPage.tsx` | シンプルな表示専用コンポーネント |

### Step 6: アプリ全体の構成

| # | ファイル | 学べること |
|---|---------|-----------|
| 21 | `src/App.tsx` | **React Router** + **React.lazy + Suspense** + Provider + ErrorBoundary |
| 22 | `src/main.tsx` | エントリーポイント、createRoot、StrictMode |

### Step 7: スタイリング

| # | ファイル | 学べること |
|---|---------|-----------|
| 23 | `src/index.css` | CSS 変数、`prefers-color-scheme` によるダークモード |
| 24 | `src/App.css` | BEM 記法、レスポンシブ対応 |

---

## 01-task-manager との比較

| 観点 | 01-task-manager | 01b-recipe-book |
|------|----------------|-----------------|
| **ドメイン** | タスク管理 | レシピ管理 |
| **データ永続化** | バックエンド API (FastAPI) | localStorage のみ |
| **Context の用途** | テーマ切替 (light/dark) | 単位切替 (metric/imperial) |
| **useReducer** | タスク CRUD + フィルター | レシピ CRUD + お気に入り |
| **React.memo** | TaskItem | RecipeCard |
| **createPortal** | ヘルプモーダル | レシピ詳細モーダル |
| **React.lazy** | AboutPage | FavoritesPage |
| **useMemo** | タスク統計（件数・完了率） | レシピ統計（カロリー平均・カテゴリ別） |
| **useRef** | タスク名入力にフォーカス | レシピ名入力にフォーカス |
| **レイアウト** | children Props | React Router Outlet |
| **コメント量** | 約 30-40%（初学者向け） | 約 15-20%（復習向け） |
| **フォーム** | 単一入力 | 動的フォーム（材料・手順の追加/削除） |

### 同じパターン（復習ポイント）

- useReducer + dispatch による状態管理
- Context API の Provider / useContext / カスタムフック
- React.memo + useCallback の組み合わせ
- createPortal でモーダルを body 直下に描画
- Error Boundary はクラスコンポーネントで書く
- React.lazy + Suspense でコード分割
- React Router で SPA ルーティング

### 新しいポイント

- localStorage を useEffect で同期する（バックエンドなし）
- 単位変換ロジックを Context に持たせる
- 動的フォーム（配列の状態を追加・削除）
- React Router の Outlet によるレイアウト
- `prefers-color-scheme` による OS 連動ダークモード
