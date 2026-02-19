// 【このファイルで学べること】
// - カスタムフックで取得したデータと操作関数をコンポーネントに配る
// - useState でモーダル・フォーム状態を管理する

import { useState, useCallback } from "react";
import { useRecipes } from "../hooks/useRecipes";
import { RecipeForm } from "../components/RecipeForm";
import { RecipeList } from "../components/RecipeList";
import { RecipeStats } from "../components/RecipeStats";
import { Modal } from "../components/Modal";
import { useUnit } from "../contexts/UnitContext";
import type { Recipe, Category } from "../types";

export function HomePage() {
  const {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
  } = useRecipes();

  const { convertAmount } = useUnit();

  const [category, setCategory] = useState<Category | "すべて">("すべて");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelect = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  const handleSubmit = useCallback(
    (recipe: Omit<Recipe, "id" | "createdAt">) => {
      if (editingRecipe) {
        updateRecipe({ ...editingRecipe, ...recipe });
        setEditingRecipe(null);
      } else {
        addRecipe(recipe);
      }
      setShowForm(false);
    },
    [editingRecipe, addRecipe, updateRecipe]
  );

  const handleEdit = useCallback((recipe: Recipe) => {
    setEditingRecipe(recipe);
    setSelectedRecipe(null);
    setShowForm(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingRecipe(null);
    setShowForm(false);
  }, []);

  return (
    <div className="home-page">
      <div className="home-page__header">
        <h1 className="home-page__title">レシピ一覧</h1>
        <button
          className="home-page__add-btn"
          onClick={() => { setEditingRecipe(null); setShowForm(!showForm); }}
        >
          {showForm ? "フォームを閉じる" : "+ レシピを追加"}
        </button>
      </div>

      {showForm && (
        <RecipeForm
          onSubmit={handleSubmit}
          editingRecipe={editingRecipe}
          onCancelEdit={handleCancelEdit}
        />
      )}

      <RecipeStats
        recipes={recipes}
        category={category}
        onCategoryChange={setCategory}
      />

      <RecipeList
        recipes={recipes}
        category={category}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteRecipe}
        onSelect={handleSelect}
      />

      {/* レシピ詳細モーダル（createPortal で body 直下に描画される） */}
      <Modal
        isOpen={selectedRecipe !== null}
        onClose={handleCloseModal}
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
                  <li key={i}>
                    {ing.name}: {converted.amount} {converted.unit}
                  </li>
                );
              })}
            </ul>

            <h3>手順</h3>
            <ol className="recipe-detail__steps">
              {selectedRecipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            <div className="recipe-detail__actions">
              <button
                className="recipe-detail__edit-btn"
                onClick={() => handleEdit(selectedRecipe)}
              >
                編集する
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
