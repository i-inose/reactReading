// ============================================================
// ProductForm.tsx ― 商品追加・編集フォームコンポーネント
//
// 【このファイルで学べること】
// 1. フォーム送信の処理（onSubmit + preventDefault）
// 2. 複数の入力フィールドの状態管理
// 3. 非同期処理中のローディング状態
// 4. モーダルダイアログの実装
// ============================================================

import { useState, useEffect } from "react";
import type { Category, ProductCreateInput } from "../types";
import { createProduct, fetchCategories } from "../api";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// --------------------------------------------------
// ProductForm コンポーネント
// --------------------------------------------------
export function ProductForm({ isOpen, onClose, onSuccess }: ProductFormProps) {
  // フォームの各フィールドの状態
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カテゴリ一覧を取得する
  useEffect(() => {
    if (isOpen) {
      fetchCategories().then(setCategories).catch(() => {});
    }
  }, [isOpen]);

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    // デフォルトのフォーム送信（ページリロード）を防ぐ
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data: ProductCreateInput = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId),
      };
      await createProduct(data);

      // フォームをリセットしてモーダルを閉じる
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setCategoryId("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  // モーダルが閉じているときは何も描画しない
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation: 内側のクリックでモーダルが閉じないようにする */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">商品を追加</h2>
          <button className="modal__close" onClick={onClose}>&times;</button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {error && <p className="product-form__error">{error}</p>}

          <label className="product-form__label">
            商品名 *
            <input
              type="text"
              className="product-form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={200}
            />
          </label>

          <label className="product-form__label">
            説明
            <textarea
              className="product-form__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <div className="product-form__row">
            <label className="product-form__label">
              価格 *
              <input
                type="number"
                className="product-form__input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={1}
              />
            </label>
            <label className="product-form__label">
              在庫数
              <input
                type="number"
                className="product-form__input"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min={0}
              />
            </label>
          </div>

          <label className="product-form__label">
            カテゴリ *
            <select
              className="product-form__select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">選択してください</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="product-form__actions">
            <button
              type="button"
              className="product-form__btn product-form__btn--cancel"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="product-form__btn product-form__btn--submit"
              disabled={submitting}
            >
              {submitting ? "作成中..." : "追加する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
