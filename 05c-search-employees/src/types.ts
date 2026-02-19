// ============================================================
// types.ts ― アプリケーション全体の型定義
//
// 【このファイルで学べること】
// 1. TypeScript のジェネリクス（PaginatedResult<T>）
// 2. リテラル型によるカテゴリ管理（Department）
// 3. インターフェースによるデータ構造の定義
// ============================================================

// --------------------------------------------------
// 部署（Department）のリテラル型
//
// 5つの部署を Union 型で定義する。
// 文字列リテラル型を使うことで、タイプミスをコンパイル時に検出できる。
// --------------------------------------------------
export type Department = "engineering" | "sales" | "marketing" | "hr" | "finance";

/** 部署の日本語表示名マッピング */
export const DEPARTMENT_LABELS: Record<Department, string> = {
  engineering: "エンジニアリング",
  sales: "営業",
  marketing: "マーケティング",
  hr: "人事",
  finance: "経理",
};

// --------------------------------------------------
// TODO(Q1): PaginatedResult<T> ジェネリクスインターフェースと
//           Employee インターフェースを定義してください
//
// 【ジェネリクスとは？】
// <T> は型の引数。PaginatedResult<Employee> のように使うと
// items が Employee[] 型になる。
// 再利用可能な型を定義するための TypeScript の重要な機能。
//
// PaginatedResult<T> には以下の5つのプロパティを持たせます:
//   items: T[]        — 現在のページのデータ配列
//   total: number     — 全データの総件数
//   page: number      — 現在のページ番号
//   limit: number     — 1ページあたりの表示件数
//   totalPages: number — 総ページ数
//
// Employee には以下の7つのプロパティを持たせます:
//   id: number         — 社員ID
//   name: string       — 氏名
//   department: Department — 所属部署（上で定義したリテラル型を使う）
//   position: string   — 役職
//   email: string      — メールアドレス
//   hireDate: string   — 入社日（ISO文字列: "2020-04-01"）
//   salary: number     — 年収
//
// ヒント: 05-api-design/src/types.ts の PaginatedResponse<T> と
//         Product インターフェースを参考にしてください
// 参考: 05-api-design/src/types.ts
// --------------------------------------------------

/** ページネーション結果（ジェネリクス） */
export interface PaginatedResult<T> {
  // ここを埋めてください（5つのプロパティの型を正しく書き換える）
  items: any;      // ← 正しい型に書き換える
  total: any;      // ← 正しい型に書き換える
  page: any;       // ← 正しい型に書き換える
  limit: any;      // ← 正しい型に書き換える
  totalPages: any; // ← 正しい型に書き換える
}

/** 社員データ */
export interface Employee {
  // ここを埋めてください（7つのプロパティの型を正しく書き換える）
  id: any;         // ← 正しい型に書き換える
  name: any;       // ← 正しい型に書き換える
  department: any; // ← 正しい型に書き換える
  position: any;   // ← 正しい型に書き換える
  email: any;      // ← 正しい型に書き換える
  hireDate: any;   // ← 正しい型に書き換える
  salary: any;     // ← 正しい型に書き換える
}

// --------------------------------------------------
// TODO(Q2): SearchParams インターフェースと
//           SortField / SortOrder リテラル型を定義してください
//
// SortField: ソート可能なカラム名
//   "name" | "hireDate" | "salary" | "department" の4つ
//
// SortOrder: ソート順序
//   "asc" | "desc" の2つ
//
// SearchParams には以下の6つのプロパティを持たせます:
//   page: number                — 現在のページ番号
//   limit: number               — 1ページあたりの表示件数
//   query: string               — 検索キーワード（名前で検索）
//   department: Department | "all" — 部署フィルタ（"all" は全部署）
//   sort: SortField              — ソートするカラム
//   order: SortOrder             — ソート順序
//
// ヒント: 05-api-design/src/types.ts の SortField, SortOrder,
//         ProductQueryParams を参考にしてください。
//         Department | "all" のように、既存の型と文字列リテラルを
//         組み合わせた Union 型が作れます。
// 参考: 05-api-design/src/types.ts
// --------------------------------------------------

/** ソート可能なカラム名 */
export type SortField = any; // ← 正しいリテラル型の Union に書き換える

/** ソート順序 */
export type SortOrder = any; // ← 正しいリテラル型の Union に書き換える

/** 検索パラメータ */
export interface SearchParams {
  // ここを埋めてください（6つのプロパティの型を正しく書き換える）
  page: any;       // ← 正しい型に書き換える
  limit: any;      // ← 正しい型に書き換える
  query: any;      // ← 正しい型に書き換える
  department: any; // ← 正しい型に書き換える
  sort: any;       // ← 正しい型に書き換える
  order: any;      // ← 正しい型に書き換える
}
