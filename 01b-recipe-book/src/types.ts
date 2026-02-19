// 【このファイルで学べること】
// - アプリ全体の型定義を1ファイルにまとめるパターン
// - 判別共用体（Discriminated Union）によるアクション型

export type Category = "和食" | "洋食" | "中華" | "デザート";

export type UnitSystem = "metric" | "imperial";

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  category: Category;
  ingredients: Ingredient[];
  steps: string[];
  calories: number;
  servings: number;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

// useReducer のアクション型 ― 判別共用体で定義する
// type プロパティがタグになり、switch 文で安全に分岐できる
export type RecipeAction =
  | { type: "ADD"; payload: Recipe }
  | { type: "UPDATE"; payload: Recipe }
  | { type: "DELETE"; payload: number }
  | { type: "TOGGLE_FAVORITE"; payload: number }
  | { type: "LOAD"; payload: Recipe[] };
