// ============================================================
// GenreFilter.tsx ― ジャンルフィルタボタン群
//
// 【このファイルで学べること】
// - 配列の map で動的にボタンを生成する
// - 条件付きクラス名の組み立て（アクティブ状態の表現）
// ============================================================

import { GENRES } from "../types";

interface GenreFilterProps {
  selectedGenre: string;
  onChange: (genre: string) => void;
}

export function GenreFilter({ selectedGenre, onChange }: GenreFilterProps) {
  return (
    <div className="genre-filter">
      <button
        className={`genre-filter__btn ${selectedGenre === "" ? "genre-filter__btn--active" : ""}`}
        onClick={() => onChange("")}
      >
        すべて
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre}
          className={`genre-filter__btn ${selectedGenre === genre ? "genre-filter__btn--active" : ""}`}
          onClick={() => onChange(selectedGenre === genre ? "" : genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
