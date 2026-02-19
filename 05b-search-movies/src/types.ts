// ============================================================
// types.ts ― アプリケーション全体の型定義
//
// 【このファイルで学べること】
// 1. リテラル型による有限の選択肢の表現（Genre）
// 2. ジェネリクス（PaginatedResult<T>）で再利用可能な型を作る
// 3. インターフェースでデータの形を定義するパターン
// ============================================================

// --------------------------------------------------
// ジャンル（Genre）のリテラル型
// --------------------------------------------------

export type Genre =
  | "アクション"
  | "コメディ"
  | "ドラマ"
  | "SF"
  | "ホラー"
  | "アニメ"
  | "ドキュメンタリー";

export const GENRES: Genre[] = [
  "アクション",
  "コメディ",
  "ドラマ",
  "SF",
  "ホラー",
  "アニメ",
  "ドキュメンタリー",
];

// --------------------------------------------------
// 映画（Movie）の型定義
// --------------------------------------------------

export interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: Genre;
  rating: number;    // 1.0〜5.0
  duration: number;  // 分
  description: string;
  posterUrl: string;  // picsum.photos プレースホルダー
}

// --------------------------------------------------
// ページネーション付き結果の型（ジェネリクス）
//
// PaginatedResult<Movie> のように使うと
// data が Movie[] 型になる。
// --------------------------------------------------

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------------------------------------------------
// 検索パラメータの型定義
// --------------------------------------------------

export type SortField = "title" | "year" | "rating" | "duration";
export type SortOrder = "asc" | "desc";

export interface MovieSearchParams {
  page: number;
  limit: number;
  search: string;
  genre: string;
  sort: SortField;
  order: SortOrder;
}
