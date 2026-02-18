// ============================================================
// api.ts ― REST API クライアント関数
//
// 【このファイルで学べること】
// 1. fetch API を使った HTTP リクエストの送信
// 2. クエリパラメータの動的構築（URLSearchParams）
// 3. 型安全な API クライアントの設計パターン
// 4. エラーハンドリング（レスポンスステータスのチェック）
// ============================================================

import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  PaginatedResponse,
  ProductQueryParams,
  Category,
  JobStatus,
} from "./types";

// --------------------------------------------------
// ベース URL（Vite プロキシ経由なので相対パスで OK）
// --------------------------------------------------
const BASE = "/api";

// --------------------------------------------------
// 共通ヘルパー: レスポンスのエラーチェック
//
// 【throw とは？】
// エラーを発生させて処理を中断する。
// 呼び出し元の try-catch や .catch() で捕捉できる。
// --------------------------------------------------
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // サーバーからのエラーメッセージを取得する
    const error = await res.json().catch(() => ({ detail: "不明なエラー" }));
    throw new Error(error.detail || `HTTP Error: ${res.status}`);
  }
  return res.json();
}

// --------------------------------------------------
// 商品 API
// --------------------------------------------------

/**
 * 商品一覧を取得する（ページネーション + フィルタ + ソート）
 *
 * 【URLSearchParams とは？】
 * クエリパラメータを安全に構築するための Web API。
 * 特殊文字のエスケープやパラメータの追加・削除が簡単にできる。
 */
export async function fetchProducts(
  params: ProductQueryParams
): Promise<PaginatedResponse<Product>> {
  // URLSearchParams でクエリ文字列を構築する
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  query.set("sort", params.sort);
  query.set("order", params.order);

  // 値がある場合のみパラメータに追加する（不要なパラメータを送らない）
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.minPrice !== null) query.set("min_price", String(params.minPrice));
  if (params.maxPrice !== null) query.set("max_price", String(params.maxPrice));

  const res = await fetch(`${BASE}/products?${query}`);
  return handleResponse<PaginatedResponse<Product>>(res);
}

/** 商品を1件取得する */
export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  return handleResponse<Product>(res);
}

/** 商品を新規作成する */
export async function createProduct(data: ProductCreateInput): Promise<Product> {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(res);
}

/** 商品を部分更新する */
export async function updateProduct(
  id: number,
  data: ProductUpdateInput
): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(res);
}

/** 商品を削除する */
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE}/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "削除に失敗しました" }));
    throw new Error(error.detail);
  }
}

// --------------------------------------------------
// CSV インポート API
// --------------------------------------------------

/** CSV ファイルで商品を一括インポートする */
export async function importProductsCsv(
  file: File
): Promise<{ job_id: string; message: string }> {
  // FormData: ファイルアップロードに使う Web API
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE}/products/import`, {
    method: "POST",
    body: formData,
    // Content-Type は FormData の場合に自動設定される（手動で設定しない）
  });
  return handleResponse(res);
}

/** ジョブの進捗状況を取得する */
export async function fetchJobStatus(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${BASE}/jobs/${jobId}`);
  return handleResponse<JobStatus>(res);
}

// --------------------------------------------------
// カテゴリ API
// --------------------------------------------------

/** 全カテゴリを取得する */
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories`);
  return handleResponse<Category[]>(res);
}
