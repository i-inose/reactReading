// 【このファイルで学べること】
// - React.lazy で遅延読み込みされるページ（default export が必要）
// - 01-task-manager の AboutPage と同じパターン

import { useRecipes } from "../hooks/useRecipes";
import { RecipeCard } from "../components/RecipeCard";
import { useState, useCallback } from "react";
import { Modal } from "../components/Modal";
import { useUnit } from "../contexts/UnitContext";
import type { Recipe } from "../types";

export default function FavoritesPage() {
  const { recipes, toggleFavorite, deleteRecipe } = useRecipes();
  const { convertAmount } = useUnit();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const favorites = recipes.filter((r) => r.isFavorite);

  const handleSelect = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  return (
    <div className="favorites-page">
      <h1 className="favorites-page__title">お気に入りレシピ</h1>

      {favorites.length === 0 ? (
        <p className="favorites-page__empty">
          お気に入りのレシピがまだありません。ホームページでハートを押して追加しましょう。
        </p>
      ) : (
        <div className="recipe-list">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteRecipe}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={selectedRecipe !== null}
        onClose={handleClose}
        title={selectedRecipe?.name ?? ""}
      >
        {selectedRecipe && (
          <div className="recipe-detail">
            <img
              className="recipe-detail__image"
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.name}
            />
            <p className="recipe-detail__meta">
              {selectedRecipe.category} / {selectedRecipe.calories} kcal / {selectedRecipe.servings}人前
            </p>
            <h3>材料</h3>
            <ul className="recipe-detail__ingredients">
              {selectedRecipe.ingredients.map((ing, i) => {
                const converted = convertAmount(ing.amount, ing.unit);
                return (
                  <li key={i}>{ing.name}: {converted.amount} {converted.unit}</li>
                );
              })}
            </ul>
            <h3>手順</h3>
            <ol className="recipe-detail__steps">
              {selectedRecipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </Modal>
    </div>
  );
}
