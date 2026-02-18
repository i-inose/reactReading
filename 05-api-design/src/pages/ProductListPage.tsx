// ============================================================
// ProductListPage.tsx ― 商品一覧ページ
//
// 【このファイルで学べること】
// 1. カスタムフック（useProducts）で状態管理を分離する設計
// 2. 検索・フィルタ・ソート・ページネーションの統合
// 3. テーブル/カード表示の切り替え
// 4. CSV インポート機能（ファイルアップロード + ジョブ追跡）
// ============================================================

import { useState, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { SearchBar } from "../components/SearchBar";
import { FilterPanel } from "../components/FilterPanel";
import { SortSelect } from "../components/SortSelect";
import { Pagination } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { ProductTable } from "../components/ProductTable";
import { ProductForm } from "../components/ProductForm";
import { importProductsCsv, fetchJobStatus } from "../api";
import type { JobStatus } from "../types";

// --------------------------------------------------
// 表示モードの型（テーブル or カード）
// --------------------------------------------------
type ViewMode = "table" | "card";

// --------------------------------------------------
// ProductListPage コンポーネント
// --------------------------------------------------
export function ProductListPage() {
  // useProducts フックから全ての状態と操作関数を取得する
  const {
    products, categories, total, totalPages,
    loading, error, page, limit,
    search, category, minPrice, maxPrice, sort, order,
    setPage, setSearch, setCategory, setPriceRange, setSort,
    resetFilters, reload,
  } = useProducts();

  // 表示モード（テーブル / カード）
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // 商品追加モーダルの開閉状態
  const [showForm, setShowForm] = useState(false);

  // CSV インポートの状態
  const [importJob, setImportJob] = useState<JobStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // CSV インポート処理
  // --------------------------------------------------
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importProductsCsv(file);
      // ジョブのポーリング（定期的に状態を問い合わせる）
      const jobId = result.job_id;
      const poll = setInterval(async () => {
        const status = await fetchJobStatus(jobId);
        setImportJob(status);
        // 完了または失敗でポーリングを停止する
        if (status.status === "completed" || status.status === "failed") {
          clearInterval(poll);
          if (status.status === "completed") reload();
        }
      }, 1000);
    } catch {
      setImportJob({
        job_id: "", status: "failed",
        message: "インポートに失敗しました", processed: 0, total: 0,
      });
    }

    // ファイル入力をリセットする（同じファイルを再選択可能にする）
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="product-list-page">
      {/* ページヘッダー */}
      <div className="product-list-page__header">
        <h1 className="product-list-page__title">商品一覧</h1>
        <div className="product-list-page__actions">
          {/* CSV インポートボタン */}
          <label className="btn btn--secondary">
            CSV インポート
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="visually-hidden"
              onChange={handleImport}
            />
          </label>
          {/* 商品追加ボタン */}
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            + 商品を追加
          </button>
        </div>
      </div>

      {/* インポートジョブの進捗表示 */}
      {importJob && (
        <div className={`import-status import-status--${importJob.status}`}>
          <span>{importJob.message}</span>
          {importJob.status === "processing" && (
            <span> ({importJob.processed}/{importJob.total})</span>
          )}
          <button
            className="import-status__close"
            onClick={() => setImportJob(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* 検索バー + ソート + 表示切替 */}
      <div className="product-list-page__toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="product-list-page__toolbar-right">
          <SortSelect sort={sort} order={order} onChange={setSort} />
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === "table" ? "view-toggle__btn--active" : ""}`}
              onClick={() => setViewMode("table")}
              aria-label="テーブル表示"
            >
              &#9776;
            </button>
            <button
              className={`view-toggle__btn ${viewMode === "card" ? "view-toggle__btn--active" : ""}`}
              onClick={() => setViewMode("card")}
              aria-label="カード表示"
            >
              &#9638;
            </button>
          </div>
        </div>
      </div>

      {/* フィルタパネル */}
      <FilterPanel
        categories={categories}
        selectedCategory={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onCategoryChange={setCategory}
        onPriceChange={setPriceRange}
        onReset={resetFilters}
      />

      {/* エラー表示 */}
      {error && <p className="error-message">{error}</p>}

      {/* ローディング表示 */}
      {loading && <div className="loading-spinner">読み込み中...</div>}

      {/* 商品一覧 */}
      {!loading && products.length === 0 && (
        <p className="empty-message">商品が見つかりません</p>
      )}

      {!loading && products.length > 0 && (
        <>
          {viewMode === "table" ? (
            <ProductTable
              products={products}
              sort={sort}
              order={order}
              onSort={setSort}
            />
          ) : (
            <div className="product-card-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ページネーション */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}

      {/* 商品追加フォーム（モーダル） */}
      <ProductForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={reload}
      />
    </div>
  );
}
