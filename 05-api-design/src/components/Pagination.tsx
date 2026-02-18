// ============================================================
// Pagination.tsx ― ページネーションコンポーネント
//
// 【このファイルで学べること】
// 1. ページ番号の範囲計算ロジック
// 2. disabled 属性による操作制御
// 3. aria 属性によるアクセシビリティ対応
// ============================================================

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

// --------------------------------------------------
// Pagination コンポーネント
// --------------------------------------------------
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  // データがない場合は表示しない
  if (totalPages <= 0) return null;

  // --------------------------------------------------
  // ページ番号の範囲を計算する
  //
  // 例: 現在ページ = 5, 総ページ = 20 のとき
  //     [3, 4, 5, 6, 7] を表示する（前後2ページずつ）
  //
  // Math.max/min でページ番号が範囲外にならないよう制限する
  // --------------------------------------------------
  const range = 2; // 前後に表示するページ数
  const start = Math.max(1, page - range);
  const end = Math.min(totalPages, page + range);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 現在表示している件数の範囲を計算する（例: "11〜20 / 52件"）
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      {/* 件数情報 */}
      <span className="pagination__info">
        {from}〜{to} / {total}件
      </span>

      <div className="pagination__controls">
        {/* 最初のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="最初のページ"
        >
          &laquo;
        </button>

        {/* 前のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="前のページ"
        >
          &lsaquo;
        </button>

        {/* ページ番号ボタン */}
        {start > 1 && <span className="pagination__ellipsis">...</span>}
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__btn ${
              p === page ? "pagination__btn--active" : ""
            }`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="pagination__ellipsis">...</span>}

        {/* 次のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="次のページ"
        >
          &rsaquo;
        </button>

        {/* 最後のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="最後のページ"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
