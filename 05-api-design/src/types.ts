// ============================================================
// types.ts ― アプリケーション全体の型定義
//
// 【このファイルで学べること】
// 1. TypeScript のジェネリクス（PaginatedResponse<T>）
// 2. API レスポンスの型をフロントエンドで定義するパターン
// 3. Union 型によるステータス管理
// ============================================================

// --------------------------------------------------
// 商品（Product）の型定義
// --------------------------------------------------

/** 商品データ（API から返される完全な型） */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

/** 商品作成時の入力型（id や日時はサーバーが自動生成） */
export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}

/** 商品更新時の入力型（全フィールド Optional = PATCH 用） */
export type ProductUpdateInput = Partial<ProductCreateInput>;

// --------------------------------------------------
// カテゴリ（Category）の型定義
// --------------------------------------------------

export interface Category {
  id: number;
  name: string;
}

// --------------------------------------------------
// ページネーション付きレスポンスの型
//
// 【ジェネリクスとは？】
// <T> は型の引数。PaginatedResponse<Product> のように
// 使うと data が Product[] 型になる。
// 再利用可能な型を定義するための TypeScript の重要な機能。
// --------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --------------------------------------------------
// フィルタリング・ソートの型定義
// --------------------------------------------------

/** ソート可能なカラム名 */
export type SortField = "name" | "price" | "created_at" | "stock";

/** ソート順序 */
export type SortOrder = "asc" | "desc";

/** フィルタ条件 */
export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
}

/** 商品一覧画面の全パラメータ（URL クエリと同期させる） */
export interface ProductQueryParams {
  page: number;
  limit: number;
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortField;
  order: SortOrder;
}

// --------------------------------------------------
// バックグラウンドジョブの型定義
// --------------------------------------------------

/** ジョブのステータス（リテラル型で限定する） */
export type JobStatusType = "pending" | "processing" | "completed" | "failed";

export interface JobStatus {
  job_id: string;
  status: JobStatusType;
  message: string;
  processed: number;
  total: number;
}
