// ============================================================
// Pagination.tsx ― ページネーション（省略記号付き）
//
// 【このファイルで学べること】
// - ページ番号の範囲計算（前後2ページ + 省略記号）
// - disabled 属性による操作制御
// ============================================================

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 0) return null;

  const range = 2;
  const start = Math.max(1, page - range);
  const end = Math.min(totalPages, page + range);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="pagination__info">
        {from}〜{to} / {total}件
      </span>

      <div className="pagination__controls">
        <button
          className="pagination__btn"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="最初のページ"
        >
          &laquo;
        </button>
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="前のページ"
        >
          &lsaquo;
        </button>

        {start > 1 && <span className="pagination__ellipsis">...</span>}
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="pagination__ellipsis">...</span>}

        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="次のページ"
        >
          &rsaquo;
        </button>
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
