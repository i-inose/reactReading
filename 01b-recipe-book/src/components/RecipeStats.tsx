// 【このファイルで学べること】
// - useMemo で重い計算をメモ化する（recipes が変わったときだけ再計算）
// - オブジェクトの分割代入

import { useMemo } from "react";
import type { Recipe, Category } from "../types";

const CATEGORIES: (Category | "すべて")[] = ["すべて", "和食", "洋食", "中華", "デザート"];

interface RecipeStatsProps {
  recipes: Recipe[];
  category: Category | "すべて";
  onCategoryChange: (category: Category | "すべて") => void;
}

export function RecipeStats({ recipes, category, onCategoryChange }: RecipeStatsProps) {
  // useMemo: 依存配列が変わるまで計算結果をキャッシュする
  // カロリー平均やカテゴリ別件数など、毎回計算すると重いものに使う
  const stats = useMemo(() => {
    const total = recipes.length;
    const favorites = recipes.filter((r) => r.isFavorite).length;
    const avgCalories = total > 0
      ? Math.round(recipes.reduce((sum, r) => sum + r.calories, 0) / total)
      : 0;

    // カテゴリ別の件数を集計する
    const byCategory = recipes.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] ?? 0) + 1;
      return acc;
    }, {});

    return { total, favorites, avgCalories, byCategory };
  }, [recipes]);

  return (
    <div className="recipe-stats">
      <div className="recipe-stats__summary">
        <span>全 {stats.total} 品</span>
        <span>お気に入り {stats.favorites} 品</span>
        <span>平均 {stats.avgCalories} kcal</span>
        {Object.entries(stats.byCategory).map(([cat, count]) => (
          <span key={cat}>{cat}: {count}</span>
        ))}
      </div>

      <div className="recipe-stats__filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`recipe-stats__filter-btn ${
              category === c ? "recipe-stats__filter-btn--active" : ""
            }`}
            onClick={() => onCategoryChange(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
