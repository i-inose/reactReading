// 【このファイルで学べること】
// - useState でフォーム状態を管理する
// - useRef で input に自動フォーカスする
// - 動的フォーム（材料・手順の追加・削除）

import { useState, useRef, useEffect } from "react";
import type { Recipe, Category, Ingredient } from "../types";

const CATEGORIES: Category[] = ["和食", "洋食", "中華", "デザート"];

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, "id" | "createdAt">) => void;
  editingRecipe?: Recipe | null;
  onCancelEdit?: () => void;
}

export function RecipeForm({ onSubmit, editingRecipe, onCancelEdit }: RecipeFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("和食");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: 0, unit: "g" },
  ]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [calories, setCalories] = useState(0);
  const [servings, setServings] = useState(2);
  const [imageUrl, setImageUrl] = useState("");

  // useRef: DOM 要素への参照を保持する。再レンダリングしても値が保たれる
  const nameInputRef = useRef<HTMLInputElement>(null);

  // マウント時に名前入力欄にフォーカスする
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // 編集モード時: editingRecipe が変わったらフォームに値をセット
  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name);
      setCategory(editingRecipe.category);
      setIngredients(editingRecipe.ingredients);
      setSteps(editingRecipe.steps);
      setCalories(editingRecipe.calories);
      setServings(editingRecipe.servings);
      setImageUrl(editingRecipe.imageUrl);
      nameInputRef.current?.focus();
    }
  }, [editingRecipe]);

  const resetForm = () => {
    setName("");
    setCategory("和食");
    setIngredients([{ name: "", amount: 0, unit: "g" }]);
    setSteps([""]);
    setCalories(0);
    setServings(2);
    setImageUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const validIngredients = ingredients.filter((ing) => ing.name.trim());

    onSubmit({
      name: name.trim(),
      category,
      ingredients: validIngredients,
      steps: steps.filter((s) => s.trim()),
      calories,
      servings,
      imageUrl: imageUrl || `https://placehold.co/400x300/4A90D9/FFF?text=${encodeURIComponent(name)}`,
      isFavorite: editingRecipe?.isFavorite ?? false,
    });

    if (!editingRecipe) resetForm();
    nameInputRef.current?.focus();
  };

  // --- 材料の動的操作 ---
  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: 0, unit: "g" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 手順の動的操作 ---
  const updateStep = (index: number, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const addStep = () => {
    setSteps((prev) => [...prev, ""]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h2 className="recipe-form__title">
        {editingRecipe ? "レシピを編集" : "新しいレシピを追加"}
      </h2>

      <div className="recipe-form__row">
        <input
          ref={nameInputRef}
          className="recipe-form__input"
          type="text"
          placeholder="レシピ名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="recipe-form__select"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* 材料セクション */}
      <fieldset className="recipe-form__fieldset">
        <legend>材料</legend>
        {ingredients.map((ing, i) => (
          <div key={i} className="recipe-form__ingredient-row">
            <input
              className="recipe-form__input recipe-form__input--sm"
              type="text"
              placeholder="材料名"
              value={ing.name}
              onChange={(e) => updateIngredient(i, "name", e.target.value)}
            />
            <input
              className="recipe-form__input recipe-form__input--xs"
              type="number"
              placeholder="量"
              value={ing.amount || ""}
              onChange={(e) => updateIngredient(i, "amount", Number(e.target.value))}
            />
            <input
              className="recipe-form__input recipe-form__input--xs"
              type="text"
              placeholder="単位"
              value={ing.unit}
              onChange={(e) => updateIngredient(i, "unit", e.target.value)}
            />
            {ingredients.length > 1 && (
              <button type="button" className="recipe-form__remove-btn" onClick={() => removeIngredient(i)}>
                -
              </button>
            )}
          </div>
        ))}
        <button type="button" className="recipe-form__add-btn" onClick={addIngredient}>
          + 材料を追加
        </button>
      </fieldset>

      {/* 手順セクション */}
      <fieldset className="recipe-form__fieldset">
        <legend>手順</legend>
        {steps.map((step, i) => (
          <div key={i} className="recipe-form__step-row">
            <span className="recipe-form__step-num">{i + 1}.</span>
            <input
              className="recipe-form__input"
              type="text"
              placeholder={`手順 ${i + 1}`}
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
            />
            {steps.length > 1 && (
              <button type="button" className="recipe-form__remove-btn" onClick={() => removeStep(i)}>
                -
              </button>
            )}
          </div>
        ))}
        <button type="button" className="recipe-form__add-btn" onClick={addStep}>
          + 手順を追加
        </button>
      </fieldset>

      <div className="recipe-form__row">
        <input
          className="recipe-form__input recipe-form__input--sm"
          type="number"
          placeholder="カロリー (kcal)"
          value={calories || ""}
          onChange={(e) => setCalories(Number(e.target.value))}
        />
        <input
          className="recipe-form__input recipe-form__input--xs"
          type="number"
          placeholder="人数"
          value={servings || ""}
          onChange={(e) => setServings(Number(e.target.value))}
          min={1}
        />
        <input
          className="recipe-form__input"
          type="text"
          placeholder="画像URL (省略可)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="recipe-form__actions">
        <button type="submit" className="recipe-form__submit-btn">
          {editingRecipe ? "更新" : "追加"}
        </button>
        {editingRecipe && onCancelEdit && (
          <button type="button" className="recipe-form__cancel-btn" onClick={() => { onCancelEdit(); resetForm(); }}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
