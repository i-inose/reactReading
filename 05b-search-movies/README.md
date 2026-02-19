# 05b - Movie Search（映画検索アプリ）

05-api-design と同じ React パターンを別ドメイン（映画検索）で再学習する 2nd Reading アプリ。
バックエンド不要 ― 100件のモックデータに対してクライアントサイドで検索・フィルタ・ソート・ページネーションを行う。

## 起動方法

```bash
cd 05b-search-movies
npm install
npm run dev
# → http://localhost:5173 で起動
```

## 05-api-design との比較

| 観点 | 05-api-design | 05b-search-movies |
|------|--------------|-------------------|
| ドメイン | 商品管理 | 映画検索 |
| バックエンド | FastAPI（Python） | なし（モックデータ） |
| データ取得 | fetch API → サーバー | 固定配列 → useMemo |
| useReducer | 検索状態 + API 状態 | 検索状態のみ（loading 不要） |
| useSearchParams | URL ↔ 検索条件の同期 | 同じパターン |
| useDebounce | 検索テキストのデバウンス | 同じパターン |
| ジェネリクス | PaginatedResponse\<T\> | PaginatedResult\<T\> |
| フィルタ | カテゴリ + 価格帯 | ジャンル |
| ソート | テーブルヘッダー + セレクト | テーブルヘッダー + セレクト |
| 表示切替 | カード / テーブル | カード / テーブル |
| ページネーション | 省略記号付き | 同じパターン |
| CRUD | 作成・更新・削除あり | 読み取り専用 |

## 学べる技術・パターン

| カテゴリ | パターン |
|---------|---------|
| 状態管理 | useReducer による複雑な検索状態の一元管理 |
| URL 同期 | useSearchParams でフィルタ・ソート・ページをURLに反映 |
| デバウンス | useDebounce で検索入力を遅延処理 |
| ジェネリクス | PaginatedResult\<T\>, paginate\<T\> |
| メモ化 | useMemo でフィルタ・ソート結果をキャッシュ |
| 条件付き描画 | カード / テーブル表示の切り替え |

## コードリーディング順序

### Step 1: 型定義とデータ

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/types.ts` | Genre リテラル型, Movie, PaginatedResult\<T\> |
| 2 | `src/data/movies.ts` | 100件のモックデータ |

### Step 2: ユーティリティとフック

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/utils/paginate.ts` | ジェネリック paginate\<T\>, filterAndSort |
| 2 | `src/hooks/useDebounce.ts` | ジェネリクス, useEffect クリーンアップ |
| 3 | `src/hooks/useMovies.ts` | useReducer, useSearchParams, useMemo |

### Step 3: UI コンポーネント

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/components/SearchBar.tsx` | Controlled Component |
| 2 | `src/components/GenreFilter.tsx` | ボタングループ, 条件付きクラス |
| 3 | `src/components/SortSelect.tsx` | 複合値の select 管理 |
| 4 | `src/components/ViewToggle.tsx` | トグル UI |
| 5 | `src/components/MovieCard.tsx` | カード UI, 評価バッジ |
| 6 | `src/components/MovieTable.tsx` | ソート付きテーブル |
| 7 | `src/components/Pagination.tsx` | ページ範囲計算, 省略記号 |

### Step 4: ページとルーティング

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/pages/MovieListPage.tsx` | 全コンポーネントの統合 |
| 2 | `src/pages/MovieDetailPage.tsx` | useParams, find による単一検索 |
| 3 | `src/App.tsx` | Routes / Route |
| 4 | `src/main.tsx` | createRoot, BrowserRouter |

## ファイル構成

```
05b-search-movies/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx           # エントリーポイント
    ├── App.tsx            # ルーティング
    ├── types.ts           # 型定義
    ├── index.css          # グローバルスタイル
    ├── App.css            # コンポーネントスタイル
    ├── data/
    │   └── movies.ts      # 100件のモックデータ
    ├── utils/
    │   └── paginate.ts    # ページネーション・フィルタユーティリティ
    ├── hooks/
    │   ├── useDebounce.ts # デバウンスフック
    │   └── useMovies.ts   # 映画データ管理フック
    ├── components/
    │   ├── Header.tsx     # ナビゲーション
    │   ├── SearchBar.tsx  # 検索バー
    │   ├── GenreFilter.tsx # ジャンルフィルタ
    │   ├── SortSelect.tsx # ソートセレクター
    │   ├── ViewToggle.tsx # 表示切替
    │   ├── MovieCard.tsx  # 映画カード
    │   ├── MovieTable.tsx # 映画テーブル
    │   └── Pagination.tsx # ページネーション
    └── pages/
        ├── MovieListPage.tsx  # 映画一覧ページ
        └── MovieDetailPage.tsx # 映画詳細ページ
```
