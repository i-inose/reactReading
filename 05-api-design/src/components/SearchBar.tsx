// ============================================================
// SearchBar.tsx ― 検索入力コンポーネント
//
// 【このファイルで学べること】
// 1. 制御されたコンポーネント（Controlled Component）
// 2. 親コンポーネントから渡されたコールバックの利用
// 3. input 要素のイベントハンドリング
// ============================================================

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// --------------------------------------------------
// SearchBar コンポーネント
//
// 【制御されたコンポーネントとは？】
// input の値を React の state で管理するパターン。
// value と onChange を親から受け取り、入力内容を完全に制御する。
// デバウンス処理は親（useProducts フック）で行う。
// --------------------------------------------------
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="商品名・説明で検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* 入力があるときだけクリアボタンを表示する */}
      {value && (
        <button
          className="search-bar__clear"
          onClick={() => onChange("")}
          aria-label="検索をクリア"
        >
          &times;
        </button>
      )}
    </div>
  );
}
