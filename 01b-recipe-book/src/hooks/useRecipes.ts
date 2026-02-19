// 【このファイルで学べること】
// - useReducer + useEffect で localStorage と同期するカスタムフック
// - useCallback で安定した関数参照を作り、メモ化コンポーネントの再描画を防ぐ

import { useReducer, useEffect, useCallback } from "react";
import { recipeReducer } from "../reducers/recipeReducer";
import { initialRecipes } from "../data/initialRecipes";
import type { Recipe, Category } from "../types";

const STORAGE_KEY = "recipe-book-recipes";

function loadRecipes(): Recipe[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as Recipe[] : initialRecipes;
  } catch {
    return initialRecipes;
  }
}

export function useRecipes() {
  // useReducer: 複雑な状態管理に使う（01 の useTasks と同じパターン）
  // useState との違い → 更新ロジックを reducer に集約できる
  const [recipes, dispatch] = useReducer(recipeReducer, null, loadRecipes);

  // useEffect で recipes が変わるたびに localStorage に保存する
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  // --- useCallback でメモ化した操作関数群 ---
  // React.memo された子コンポーネントに渡しても不要な再描画が起きない

  const addRecipe = useCallback((recipe: Omit<Recipe, "id" | "createdAt">) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD", payload: newRecipe });
  }, []);

  const updateRecipe = useCallback((recipe: Recipe) => {
    dispatch({ type: "UPDATE", payload: recipe });
  }, []);

  const deleteRecipe = useCallback((id: number) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  }, []);

  // カテゴリで絞り込む関数（呼び出し側でフィルタリングする設計）
  const getByCategory = useCallback(
    (category: Category | "すべて") => {
      return category === "すべて"
        ? recipes
        : recipes.filter((r) => r.category === category);
    },
    [recipes]
  );

  const getFavorites = useCallback(
    () => recipes.filter((r) => r.isFavorite),
    [recipes]
  );

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    getByCategory,
    getFavorites,
  };
}
