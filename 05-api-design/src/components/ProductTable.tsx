// ============================================================
// ProductTable.tsx ― ソート機能付き商品テーブルコンポーネント
//
// 【このファイルで学べること】
// 1. テーブルヘッダーのクリックでソートを切り替える
// 2. ソートインジケーター（矢印）の表示ロジック
// 3. 条件付きクラス名の組み立て
// ============================================================

import { Link } from "react-router-dom";
import type { Product, SortField, SortOrder } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ProductTableProps {
  products: Product[];
  sort: SortField;
  order: SortOrder;
  onSort: (sort: SortField, order: SortOrder) => void;
}

// --------------------------------------------------
// ソート可能なカラムの定義
// --------------------------------------------------
const SORTABLE_COLUMNS: { key: SortField; label: string }[] = [
  { key: "name", label: "商品名" },
  { key: "price", label: "価格" },
  { key: "stock", label: "在庫" },
  { key: "created_at", label: "登録日" },
];

// --------------------------------------------------
// ProductTable コンポーネント
// --------------------------------------------------
export function ProductTable({ products, sort, order, onSort }: ProductTableProps) {
  /**
   * ソート切り替えロジック
   * 同じカラムをクリック → asc/desc を切り替え
   * 別のカラムをクリック → そのカラムの asc でソート
   */
  const handleSortClick = (field: SortField) => {
    if (field === sort) {
      // 同じカラム: 順序を反転させる
      onSort(field, order === "asc" ? "desc" : "asc");
    } else {
      // 別のカラム: asc でソート開始
      onSort(field, "asc");
    }
  };

  // ソートインジケーター文字を返す関数
  const getSortIndicator = (field: SortField) => {
    if (field !== sort) return "";
    return order === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            {SORTABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`product-table__th product-table__th--sortable ${
                  sort === col.key ? "product-table__th--active" : ""
                }`}
                onClick={() => handleSortClick(col.key)}
              >
                {col.label}
                <span className="product-table__sort-indicator">
                  {getSortIndicator(col.key)}
                </span>
              </th>
            ))}
            <th className="product-table__th">カテゴリ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="product-table__row">
              <td className="product-table__td">
                <Link to={`/products/${product.id}`} className="product-table__link">
                  {product.name}
                </Link>
              </td>
              <td className="product-table__td product-table__td--price">
                &yen;{product.price.toLocaleString()}
              </td>
              <td className={`product-table__td ${
                product.stock <= 10 ? "product-table__td--low-stock" : ""
              }`}>
                {product.stock}
              </td>
              <td className="product-table__td product-table__td--date">
                {new Date(product.created_at).toLocaleDateString("ja-JP")}
              </td>
              <td className="product-table__td">
                <span className="product-table__category-badge">
                  {product.category_name}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
