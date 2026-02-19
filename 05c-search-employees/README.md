# 05c-search-employees ― 社員検索アプリ

React + TypeScript の穴埋め式コードリーディング教材です。
クライアントサイドで検索・フィルタ・ソート・ページネーションを実装する社員検索アプリを通して、TypeScript のジェネリクスやカスタムフックの設計パターンを学びます。

## 学習テーマ

| # | ファイル | テーマ |
|---|---------|--------|
| Q1 | `src/types.ts` | ジェネリクス（`PaginatedResult<T>`）とインターフェース定義 |
| Q2 | `src/types.ts` | リテラル型による `SortField` / `SortOrder` と `SearchParams` |
| Q3 | `src/hooks/useDebounce.ts` | ジェネリクス付きカスタムフック + useEffect クリーンアップ |
| Q4 | `src/hooks/useEmployees.ts` | `useReducer` による状態管理 |
| Q5 | `src/hooks/useEmployees.ts` | `useSearchParams` による URL 同期（双方向） |
| Q6 | `src/utils/paginate.ts` | ジェネリクス関数 `paginate<T>` + フィルタ・ソートの純粋関数 |
| Q7 | `src/components/Pagination.tsx` | ページ番号の範囲計算 + 省略記号ロジック |
| Q8 | `src/components/SearchBar.tsx` | `useDebounce` を使ったデバウンス検索 |
| Q9 | `src/components/SortHeader.tsx` | ソート方向のトグルロジック |
| Q10 | `src/pages/EmployeeListPage.tsx` | 全コンポーネントの統合 |

## 前提知識

- 05-api-design のコードリーディングが完了していること
- React の基礎（`useState`, `useEffect`, `useCallback`）
- React Router の基礎（`Link`, `useParams`, `useSearchParams`）

## セットアップ

```bash
cd 05c-search-employees
npm install
npm run dev
```

## 進め方

1. `src/` 配下のファイルを上から順に読む
2. `TODO(Q1)` 〜 `TODO(Q10)` を探して穴埋めする
3. `npm run dev` で動作確認する
4. 答え合わせは `_answers/README.md` を参照

## アプリの機能

- 60名の社員データ（日本語名、5部署）をテーブルで一覧表示
- 社員名で検索（デバウンス付き）
- 部署でフィルタリング
- 氏名・部署・入社日・年収でソート（昇順/降順）
- ページネーション（1ページ10件）
- URL クエリパラメータとの同期（リロードでフィルタ状態を保持）
- 社員詳細ページ（クリックで遷移）

## 参考にするファイル

穴埋め箇所のヒントとして、`05-api-design` のファイルを参考にしてください:

- `05-api-design/src/types.ts` → Q1, Q2
- `05-api-design/src/hooks/useDebounce.ts` → Q3
- `05-api-design/src/hooks/useProducts.ts` → Q4, Q5
- `05-api-design/src/components/Pagination.tsx` → Q7
- `05-api-design/src/components/SearchBar.tsx` → Q8
- `05-api-design/src/components/ProductTable.tsx` → Q9
- `05-api-design/src/pages/ProductListPage.tsx` → Q10
