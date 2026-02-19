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
// TODO(Q7): ページ番号の配列を計算し、ページネーション UI を構築してください
//
// 以下を実装します:
//   1. 現在ページの前後2ページ分のページ番号配列を生成する
//      例: page=5, totalPages=10 → [3, 4, 5, 6, 7]
//      例: page=1, totalPages=10 → [1, 2, 3]
//      例: page=10, totalPages=10 → [8, 9, 10]
//
//   2. 省略記号（...）の表示条件:
//      - start > 1 のとき、先頭に ... を表示
//      - end < totalPages のとき、末尾に ... を表示
//
//   3. 「前へ」「次へ」ボタンの disabled 条件:
//      - page === 1 のとき「前へ」を無効化
//      - page === totalPages のとき「次へ」を無効化
//
//   4. 件数表示テキスト:
//      from = (page - 1) * limit + 1
//      to = Math.min(page * limit, total)
//      「{from}〜{to} / {total}件」の形式で表示
//
// ヒント: Math.max(1, page - range) で開始ページ、
//         Math.min(totalPages, page + range) で終了ページを求める。
//         for ループでページ番号を配列に push する。
// 参考: 05-api-design/src/components/Pagination.tsx
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

  // ページ番号の配列を生成してください
  const _range = 2; // 前後に表示するページ数
  const pages: number[] = []; // ← ここにページ番号を生成するロジックを書く

  // 件数表示の計算をしてください
  const _from = 0; // ← (page - 1) * limit + 1 に置き換える
  const _to = 0;   // ← Math.min(page * limit, total) に置き換える

  void _range;
  void _from;
  void _to;
  void page;
  void totalPages;
  void total;
  void limit;
  void onPageChange;

  return (
    <div className="pagination">
      {/* 件数情報: {from}〜{to} / {total}件 と表示してください */}
      <span className="pagination__info">
        {/* ここに件数テキストを表示 */}
      </span>

      <div className="pagination__controls">
        {/* 最初のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(1)}
          disabled={false} // ← page === 1 に置き換える
          aria-label="最初のページ"
        >
          &laquo;
        </button>

        {/* 前のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={false} // ← page === 1 に置き換える
          aria-label="前のページ"
        >
          &lsaquo;
        </button>

        {/* 先頭の省略記号 */}

        {/* ページ番号ボタン: pages.map で各ページのボタンを描画してください */}
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

        {/* 末尾の省略記号 */}

        {/* 次のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={false} // ← page === totalPages に置き換える
          aria-label="次のページ"
        >
          &rsaquo;
        </button>

        {/* 最後のページへ */}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(totalPages)}
          disabled={false} // ← page === totalPages に置き換える
          aria-label="最後のページ"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
