// ============================================================
// SortSelect.tsx ― ソート条件セレクターコンポーネント
//
// 【このファイルで学べること】
// 1. select 要素の制御（Controlled Component）
// 2. 複合値（sort + order）を1つの select で管理する手法
// 3. 文字列の分割（split）による値の解析
// ============================================================

import type { SortField, SortOrder } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface SortSelectProps {
  sort: SortField;
  order: SortOrder;
  onChange: (sort: SortField, order: SortOrder) => void;
}

// --------------------------------------------------
// ソートオプション定義
// value: "フィールド名_ソート順" の形式で複合値を管理する
// --------------------------------------------------
const SORT_OPTIONS = [
  { value: "created_at_desc", label: "新しい順" },
  { value: "created_at_asc", label: "古い順" },
  { value: "price_asc", label: "価格が安い順" },
  { value: "price_desc", label: "価格が高い順" },
  { value: "name_asc", label: "名前 A→Z" },
  { value: "name_desc", label: "名前 Z→A" },
  { value: "stock_desc", label: "在庫が多い順" },
  { value: "stock_asc", label: "在庫が少ない順" },
];

// --------------------------------------------------
// SortSelect コンポーネント
// --------------------------------------------------
export function SortSelect({ sort, order, onChange }: SortSelectProps) {
  // 現在の sort + order を結合して select の value にする
  const currentValue = `${sort}_${order}`;

  const handleChange = (value: string) => {
    // "price_asc" → ["price", "asc"] に分割する
    const lastUnderscore = value.lastIndexOf("_");
    const newSort = value.slice(0, lastUnderscore) as SortField;
    const newOrder = value.slice(lastUnderscore + 1) as SortOrder;
    onChange(newSort, newOrder);
  };

  return (
    <div className="sort-select">
      <label className="sort-select__label" htmlFor="sort">
        並び替え:
      </label>
      <select
        id="sort"
        className="sort-select__select"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
