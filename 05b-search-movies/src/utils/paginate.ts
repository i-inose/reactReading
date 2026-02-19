// ============================================================
// paginate.ts ― 汎用ページネーション＆フィルタリングユーティリティ
//
// 【このファイルで学べること】
// 1. ジェネリクスで型安全な汎用関数を作る
// 2. Array.prototype のメソッドチェーン（filter → sort → slice）
// 3. クライアントサイドでのフィルタリング・ソート・ページネーション
// ============================================================

import type { Movie, PaginatedResult, SortField, SortOrder } from "../types";

// --------------------------------------------------
// paginate<T>: 配列をページ分割する汎用関数
// --------------------------------------------------

export function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  // ページ範囲を安全にクランプする
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (safePage - 1) * limit;
  const data = items.slice(start, start + limit);

  return { data, total, page: safePage, limit, totalPages };
}

// --------------------------------------------------
// filterAndSort: 映画データのフィルタリングとソートを行う
// --------------------------------------------------

export function filterAndSort(
  allMovies: Movie[],
  search: string,
  genre: string,
  sort: SortField,
  order: SortOrder,
): Movie[] {
  let result = allMovies;

  // タイトル検索（部分一致、大文字小文字を無視）
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q),
    );
  }

  // ジャンルフィルタ
  if (genre) {
    result = result.filter((m) => m.genre === genre);
  }

  // ソート
  const sorted = [...result].sort((a, b) => {
    let cmp = 0;
    switch (sort) {
      case "title":
        cmp = a.title.localeCompare(b.title, "ja");
        break;
      case "year":
        cmp = a.year - b.year;
        break;
      case "rating":
        cmp = a.rating - b.rating;
        break;
      case "duration":
        cmp = a.duration - b.duration;
        break;
    }
    return order === "asc" ? cmp : -cmp;
  });

  return sorted;
}
