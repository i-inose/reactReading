// 【このファイルで学べること】
// - React.memo で不要な再レンダリングを防ぐ
// - useCallback された関数を Props で受け取るパターン

import { memo } from "react";
import type { Recipe } from "../types";
import { useUnit } from "../contexts/UnitContext";

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (recipe: Recipe) => void;
}

// React.memo: Props が変わらなければ再レンダリングをスキップする
// 01-task-manager の TaskItem と同じ最適化パターン
export const RecipeCard = memo(function RecipeCard({
  recipe,
  onToggleFavorite,
  onDelete,
  onSelect,
}: RecipeCardProps) {
  const { convertAmount } = useUnit();

  // 材料の先頭3つを表示用に変換する
  const previewIngredients = recipe.ingredients.slice(0, 3).map((ing) => {
    const converted = convertAmount(ing.amount, ing.unit);
    return `${ing.name} ${converted.amount}${converted.unit}`;
  });

  return (
    <div className="recipe-card">
      <div className="recipe-card__image-wrap" onClick={() => onSelect(recipe)}>
        <img
          className="recipe-card__image"
          src={recipe.imageUrl}
          alt={recipe.name}
          loading="lazy"
        />
        <span className="recipe-card__category">{recipe.category}</span>
      </div>

      <div className="recipe-card__body">
        <h3 className="recipe-card__name" onClick={() => onSelect(recipe)}>
          {recipe.name}
        </h3>

        <p className="recipe-card__meta">
          {recipe.calories} kcal / {recipe.servings}人前
        </p>

        <p className="recipe-card__ingredients">
          {previewIngredients.join(", ")}
          {recipe.ingredients.length > 3 && " ..."}
        </p>

        <div className="recipe-card__actions">
          <button
            className={`recipe-card__fav-btn ${recipe.isFavorite ? "recipe-card__fav-btn--active" : ""}`}
            onClick={() => onToggleFavorite(recipe.id)}
            aria-label={recipe.isFavorite ? "お気に入り解除" : "お気に入り登録"}
          >
            {recipe.isFavorite ? "★" : "☆"}
          </button>
          <button
            className="recipe-card__delete-btn"
            onClick={() => onDelete(recipe.id)}
            aria-label="削除"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
});
