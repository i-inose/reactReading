// 【このファイルで学べること】
// - useReducer 用のリデューサー関数
// - イミュータブルな状態更新（スプレッド構文 + map/filter）

import type { Recipe, RecipeAction } from "../types";

// Reducer 関数: (現在のstate, action) → 新しいstate
// 01-task-manager の taskReducer と同じパターン
export function recipeReducer(state: Recipe[], action: RecipeAction): Recipe[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];

    case "UPDATE":
      return state.map((r) =>
        r.id === action.payload.id ? action.payload : r
      );

    case "DELETE":
      return state.filter((r) => r.id !== action.payload);

    // お気に入り切り替え: 該当レシピの isFavorite を反転する
    case "TOGGLE_FAVORITE":
      return state.map((r) =>
        r.id === action.payload ? { ...r, isFavorite: !r.isFavorite } : r
      );

    case "LOAD":
      return action.payload;

    default:
      return state;
  }
}
