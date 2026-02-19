// ============================================================
// paginate.ts ― ページネーション・フィルタ・ソートユーティリティ
//
// 【このファイルで学べること】
// 1. ジェネリクスを使った汎用関数（paginate<T>）
// 2. 純粋関数によるデータ加工（フィルタ + ソート）
// 3. Array メソッドの連鎖（filter → sort）
// ============================================================

import type { Employee, SearchParams, PaginatedResult } from "../types";

// --------------------------------------------------
// TODO(Q6): paginate 関数と filterAndSort 関数を実装してください
//
// 【paginate<T> 関数】
// 任意の配列をページネーションして PaginatedResult<T> を返す汎用関数。
//
// 引数:
//   items: T[]     — 全データの配列
//   page: number   — 現在のページ番号（1始まり）
//   limit: number  — 1ページあたりの表示件数
//
// 実装手順:
//   1. totalPages を計算する: Math.ceil(items.length / limit)
//   2. items をスライスする: items.slice((page - 1) * limit, page * limit)
//   3. PaginatedResult<T> オブジェクトを返す
//
// 【filterAndSort 関数】
// 社員データを検索条件に基づいてフィルタ・ソートする関数。
//
// 引数:
//   employees: Employee[]    — 全社員データ
//   params: SearchParams     — 検索条件
//
// 実装手順:
//   1. query でフィルタ: 名前に検索文字列が含まれるかチェック
//      （大文字小文字を無視: toLowerCase() を使う）
//   2. department でフィルタ: "all" 以外なら該当部署のみ
//   3. sort + order でソート: params.sort のカラムで昇順/降順に並べる
//      - "name", "department": 文字列比較（localeCompare）
//      - "salary": 数値比較
//      - "hireDate": 日付比較（文字列の ISO 形式なので localeCompare でOK）
//
// ヒント: 05-api-design ではこの処理はバックエンド（FastAPI）で行っていましたが、
//         このアプリではクライアントサイドで実装します。
//         Array.prototype.filter() と Array.prototype.sort() を連鎖させます。
// 参考: 05-api-design/src/types.ts の PaginatedResponse<T>（構造の参考）
// --------------------------------------------------

/** 配列をページネーションする汎用関数 */
export function paginate<T>(_items: T[], _page: number, _limit: number): PaginatedResult<T> {
  // ここを実装してください
  // 1. totalPages を計算
  // 2. items をスライス
  // 3. PaginatedResult<T> を返す

  return undefined as any; // ← 正しい PaginatedResult<T> オブジェクトに置き換える
}

/** 社員データをフィルタ・ソートする関数 */
export function filterAndSort(_employees: Employee[], _params: SearchParams): Employee[] {
  // ここを実装してください
  // 1. query で名前フィルタ（toLowerCase で大文字小文字無視）
  // 2. department フィルタ（"all" 以外）
  // 3. sort + order でソート

  return []; // ← フィルタ・ソート済みの配列に置き換える
}
