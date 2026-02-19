// ============================================================
// SearchBar.tsx ― デバウンス付き検索入力
//
// 【このファイルで学べること】
// - 制御されたコンポーネント（value + onChange）
// - クリアボタンの条件付き表示
// ============================================================

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="タイトル・監督で検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
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
