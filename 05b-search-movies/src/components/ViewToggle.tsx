// ============================================================
// ViewToggle.tsx ― カード/テーブル表示切替
//
// 【このファイルで学べること】
// - シンプルなトグル UI の実装
// - aria-label によるアクセシビリティ
// ============================================================

interface ViewToggleProps {
  viewMode: "card" | "table";
  onChange: (mode: "card" | "table") => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle__btn ${viewMode === "card" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("card")}
        aria-label="カード表示"
      >
        &#9638;
      </button>
      <button
        className={`view-toggle__btn ${viewMode === "table" ? "view-toggle__btn--active" : ""}`}
        onClick={() => onChange("table")}
        aria-label="テーブル表示"
      >
        &#9776;
      </button>
    </div>
  );
}
