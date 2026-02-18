// ============================================================
// ProductCard.tsx ― 商品カード表示コンポーネント
//
// 【このファイルで学べること】
// 1. Props でデータを受け取るパターン
// 2. 数値フォーマット（toLocaleString で 3桁カンマ区切り）
// 3. Link コンポーネントによる詳細ページへの遷移
// ============================================================

import { Link } from "react-router-dom";
import type { Product } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ProductCardProps {
  product: Product;
}

// --------------------------------------------------
// ProductCard コンポーネント
// --------------------------------------------------
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* 画像プレースホルダー（商品名の頭文字を表示） */}
      <div className="product-card__image">
        <span className="product-card__initial">
          {product.name.charAt(0)}
        </span>
      </div>

      {/* 商品情報 */}
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>

        {/* カテゴリバッジ */}
        <span className="product-card__category">{product.category_name}</span>

        {/* 価格表示 */}
        <p className="product-card__price">
          &yen;{product.price.toLocaleString()}
        </p>

        {/* 在庫表示 */}
        <p className={`product-card__stock ${
          product.stock <= 10 ? "product-card__stock--low" : ""
        }`}>
          在庫: {product.stock}
        </p>
      </div>
    </Link>
  );
}
