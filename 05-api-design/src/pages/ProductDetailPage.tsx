// ============================================================
// ProductDetailPage.tsx ― 商品詳細ページ
//
// 【このファイルで学べること】
// 1. useParams でURL パラメータを取得する方法
// 2. useNavigate でプログラム的にページ遷移する方法
// 3. 単一リソースの取得・更新・削除の UI パターン
// 4. 確認ダイアログ（window.confirm）の使い方
// ============================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProduct, updateProduct, deleteProduct, fetchCategories } from "../api";
import type { Product, Category } from "../types";

// --------------------------------------------------
// ProductDetailPage コンポーネント
// --------------------------------------------------
export function ProductDetailPage() {
  // 【useParams とは？】
  // URL のパスパラメータ（:id 部分）を取得するフック。
  // /products/42 → { id: "42" } が返る。
  const { id } = useParams<{ id: string }>();

  // 【useNavigate とは？】
  // プログラム的にページ遷移するためのフック。
  // navigate("/") でトップページに移動できる。
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // 編集フォームの状態
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");

  // --------------------------------------------------
  // 商品データを取得する
  // --------------------------------------------------
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([fetchProduct(Number(id)), fetchCategories()])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
        // 編集フォームの初期値を設定する
        setEditName(prod.name);
        setEditDescription(prod.description);
        setEditPrice(String(prod.price));
        setEditStock(String(prod.stock));
        setEditCategoryId(String(prod.category_id));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // --------------------------------------------------
  // 商品を更新する
  // --------------------------------------------------
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const updated = await updateProduct(product.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        price: Number(editPrice),
        stock: Number(editStock),
        category_id: Number(editCategoryId),
      });
      setProduct(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    }
  };

  // --------------------------------------------------
  // 商品を削除する
  // --------------------------------------------------
  const handleDelete = async () => {
    if (!product) return;
    // confirm: ブラウザ標準の確認ダイアログ
    if (!window.confirm(`「${product.name}」を削除しますか？`)) return;

    try {
      await deleteProduct(product.id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  // --------------------------------------------------
  // ローディング・エラー表示
  // --------------------------------------------------
  if (loading) return <div className="loading-spinner">読み込み中...</div>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p className="error-message">商品が見つかりません</p>;

  return (
    <div className="product-detail">
      {/* パンくずリスト */}
      <nav className="breadcrumb">
        <Link to="/">商品一覧</Link>
        <span className="breadcrumb__separator">/</span>
        <span>{product.name}</span>
      </nav>

      {editing ? (
        /* 編集モード */
        <form className="product-detail__form" onSubmit={handleUpdate}>
          <h2 className="product-detail__title">商品を編集</h2>

          <label className="product-form__label">
            商品名
            <input type="text" className="product-form__input" value={editName}
              onChange={(e) => setEditName(e.target.value)} required />
          </label>
          <label className="product-form__label">
            説明
            <textarea className="product-form__textarea" value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)} rows={3} />
          </label>
          <div className="product-form__row">
            <label className="product-form__label">
              価格
              <input type="number" className="product-form__input" value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)} required min={1} />
            </label>
            <label className="product-form__label">
              在庫
              <input type="number" className="product-form__input" value={editStock}
                onChange={(e) => setEditStock(e.target.value)} min={0} />
            </label>
          </div>
          <label className="product-form__label">
            カテゴリ
            <select className="product-form__select" value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)} required>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>

          <div className="product-form__actions">
            <button type="button" className="btn btn--secondary"
              onClick={() => setEditing(false)}>キャンセル</button>
            <button type="submit" className="btn btn--primary">更新する</button>
          </div>
        </form>
      ) : (
        /* 表示モード */
        <>
          <div className="product-detail__header">
            <div>
              <h1 className="product-detail__name">{product.name}</h1>
              <span className="product-detail__category">{product.category_name}</span>
            </div>
            <div className="product-detail__actions">
              <button className="btn btn--secondary" onClick={() => setEditing(true)}>
                編集
              </button>
              <button className="btn btn--danger" onClick={handleDelete}>
                削除
              </button>
            </div>
          </div>

          <div className="product-detail__body">
            <div className="product-detail__image">
              <span className="product-detail__initial">
                {product.name.charAt(0)}
              </span>
            </div>
            <div className="product-detail__info">
              <p className="product-detail__description">
                {product.description || "説明なし"}
              </p>
              <dl className="product-detail__specs">
                <dt>価格</dt>
                <dd>&yen;{product.price.toLocaleString()}</dd>
                <dt>在庫</dt>
                <dd>{product.stock}</dd>
                <dt>登録日</dt>
                <dd>{new Date(product.created_at).toLocaleDateString("ja-JP")}</dd>
                <dt>更新日</dt>
                <dd>{new Date(product.updated_at).toLocaleDateString("ja-JP")}</dd>
              </dl>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
