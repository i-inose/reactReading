// ============================================================
// SortSelect.tsx ― ソート条件セレクター
//
// 【このファイルで学べること】
// - 複合値（sort + order）を1つの select で管理する手法
// - lastIndexOf + slice で文字列を分割するテクニック
// ============================================================

import type { SortField, SortOrder } from "../types";

interface SortSelectProps {
  sort: SortField;
  order: SortOrder;
  onChange: (sort: SortField, order: SortOrder) => void;
}

const SORT_OPTIONS = [
  { value: "rating_desc", label: "評価が高い順" },
  { value: "rating_asc", label: "評価が低い順" },
  { value: "year_desc", label: "新しい順" },
  { value: "year_asc", label: "古い順" },
  { value: "title_asc", label: "タイトル A→Z" },
  { value: "title_desc", label: "タイトル Z→A" },
  { value: "duration_desc", label: "長い順" },
  { value: "duration_asc", label: "短い順" },
];

export function SortSelect({ sort, order, onChange }: SortSelectProps) {
  const currentValue = `${sort}_${order}`;

  const handleChange = (value: string) => {
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
