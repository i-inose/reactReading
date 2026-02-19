// ============================================================
// SortHeader.tsx ― ソート切替テーブルヘッダーコンポーネント
//
// 【このファイルで学べること】
// 1. クリックでソート方向を切り替えるロジック
// 2. 条件分岐による矢印インジケーターの表示
// 3. コールバック関数の呼び出しパターン
// ============================================================

import type { SortField, SortOrder } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface SortHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentOrder: SortOrder;
  onSort: (field: SortField, order: SortOrder) => void;
}

// --------------------------------------------------
// TODO(Q9): ソート切替ロジックを実装してください
//
// 【ソート切替のルール】
// - 同じカラムをクリック → asc/desc を切り替え
// - 別のカラムをクリック → そのカラムの asc でソート開始
//
// 以下の2つを実装します:
//   1. handleClick 関数:
//      - field === currentSort なら: 順序を反転（asc → desc, desc → asc）
//      - field !== currentSort なら: onSort(field, "asc") を呼ぶ
//
//   2. ソートインジケーター:
//      - field === currentSort かつ currentOrder === "asc" なら "▲" を表示
//      - field === currentSort かつ currentOrder === "desc" なら "▼" を表示
//      - field !== currentSort なら何も表示しない
//
// ヒント: 05-api-design/src/components/ProductTable.tsx の handleSortClick と
//         getSortIndicator を参考にしてください。
//         三項演算子 condition ? "asc" : "desc" でトグルできます。
// 参考: 05-api-design/src/components/ProductTable.tsx
// --------------------------------------------------
export function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: SortHeaderProps) {
  const handleClick = () => {
    // ここにソート切替ロジックを書いてください
    void field;
    void currentSort;
    void currentOrder;
    void onSort;
  };

  // ソートインジケーター文字を求めてください
  const indicator = ""; // ← 条件に応じて "▲", "▼", "" を返す

  return (
    <th
      className={`employee-table__th employee-table__th--sortable ${
        field === currentSort ? "employee-table__th--active" : ""
      }`}
      onClick={handleClick}
    >
      {label}
      <span className="employee-table__sort-indicator">
        {indicator}
      </span>
    </th>
  );
}
