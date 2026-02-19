// 【このファイルで学べること】
// - 配列の map でリストを描画するパターン
// - key Props の重要性（React の差分検出に必要）

import type { Recipe, Category } from "../types";
import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  category: Category | "すべて";
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (recipe: Recipe) => void;
}

export function RecipeList({
  recipes,
  category,
  onToggleFavorite,
  onDelete,
  onSelect,
}: RecipeListProps) {
  // カテゴリでフィルタリング
  const filtered = category === "すべて"
    ? recipes
    : recipes.filter((r) => r.category === category);

  if (filtered.length === 0) {
    return (
      <div className="recipe-list__empty">
        レシピがありません
      </div>
    );
  }

  return (
    <div className="recipe-list">
      {filtered.map((recipe) => (
        // key: React がリスト要素を識別するために必要。一意な値を指定する
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
