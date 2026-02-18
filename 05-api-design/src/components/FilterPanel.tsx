// ============================================================
// FilterPanel.tsx ― フィルタリングパネルコンポーネント
//
// 【このファイルで学べること】
// 1. チェックボックス風のボタングループ（ラジオ的動作）
// 2. 数値入力のバリデーションとイベント処理
// 3. フィルタリセット機能の実装
// ============================================================

import type { Category } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface FilterPanelProps {
  categories: Category[];
  selectedCategory: string;
  minPrice: number | null;
  maxPrice: number | null;
  onCategoryChange: (category: string) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
  onReset: () => void;
}

// --------------------------------------------------
// FilterPanel コンポーネント
// --------------------------------------------------
export function FilterPanel({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onReset,
}: FilterPanelProps) {

  // 価格入力のハンドラー（空文字は null として扱う）
  const handleMinPrice = (value: string) => {
    const num = value === "" ? null : Number(value);
    onPriceChange(num, maxPrice);
  };

  const handleMaxPrice = (value: string) => {
    const num = value === "" ? null : Number(value);
    onPriceChange(minPrice, num);
  };

  // フィルタが1つでも設定されているか判定する
  const hasActiveFilters = selectedCategory || minPrice !== null || maxPrice !== null;

  return (
    <div className="filter-panel">
      {/* カテゴリフィルタ */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__title">カテゴリ</h3>
        <div className="filter-panel__categories">
          {/* 「すべて」ボタン */}
          <button
            className={`filter-panel__category-btn ${
              selectedCategory === "" ? "filter-panel__category-btn--active" : ""
            }`}
            onClick={() => onCategoryChange("")}
          >
            すべて
          </button>
          {/* カテゴリボタンを動的に生成する */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-panel__category-btn ${
                selectedCategory === cat.name ? "filter-panel__category-btn--active" : ""
              }`}
              onClick={() => onCategoryChange(
                selectedCategory === cat.name ? "" : cat.name
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 価格範囲フィルタ */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__title">価格帯</h3>
        <div className="filter-panel__price-range">
          <input
            type="number"
            className="filter-panel__price-input"
            placeholder="下限"
            value={minPrice ?? ""}
            onChange={(e) => handleMinPrice(e.target.value)}
            min={0}
          />
          <span className="filter-panel__price-separator">〜</span>
          <input
            type="number"
            className="filter-panel__price-input"
            placeholder="上限"
            value={maxPrice ?? ""}
            onChange={(e) => handleMaxPrice(e.target.value)}
            min={0}
          />
          <span className="filter-panel__price-unit">円</span>
        </div>
      </div>

      {/* リセットボタン */}
      {hasActiveFilters && (
        <button className="filter-panel__reset" onClick={onReset}>
          フィルタをリセット
        </button>
      )}
    </div>
  );
}
