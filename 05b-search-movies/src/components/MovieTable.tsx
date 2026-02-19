// ============================================================
// MovieTable.tsx ― ソート機能付き映画テーブル
//
// 【このファイルで学べること】
// - テーブルヘッダーのクリックでソートを切り替える
// - ソートインジケーター（矢印）の表示ロジック
// ============================================================

import { Link } from "react-router-dom";
import type { Movie, SortField, SortOrder } from "../types";

interface MovieTableProps {
  movies: Movie[];
  sort: SortField;
  order: SortOrder;
  onSort: (sort: SortField, order: SortOrder) => void;
}

const SORTABLE_COLUMNS: { key: SortField; label: string }[] = [
  { key: "title", label: "タイトル" },
  { key: "year", label: "公開年" },
  { key: "rating", label: "評価" },
  { key: "duration", label: "時間" },
];

export function MovieTable({ movies, sort, order, onSort }: MovieTableProps) {
  // 同じカラムクリック → 順序反転、別カラム → asc 開始
  const handleSortClick = (field: SortField) => {
    if (field === sort) {
      onSort(field, order === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "asc");
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (field !== sort) return "";
    return order === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="movie-table-wrapper">
      <table className="movie-table">
        <thead>
          <tr>
            {SORTABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`movie-table__th movie-table__th--sortable ${
                  sort === col.key ? "movie-table__th--active" : ""
                }`}
                onClick={() => handleSortClick(col.key)}
              >
                {col.label}
                <span className="movie-table__sort-indicator">
                  {getSortIndicator(col.key)}
                </span>
              </th>
            ))}
            <th className="movie-table__th">監督</th>
            <th className="movie-table__th">ジャンル</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id} className="movie-table__row">
              <td className="movie-table__td">
                <Link to={`/movies/${movie.id}`} className="movie-table__link">
                  {movie.title}
                </Link>
              </td>
              <td className="movie-table__td movie-table__td--year">
                {movie.year}
              </td>
              <td className="movie-table__td movie-table__td--rating">
                {movie.rating.toFixed(1)}
              </td>
              <td className="movie-table__td movie-table__td--duration">
                {movie.duration}分
              </td>
              <td className="movie-table__td">{movie.director}</td>
              <td className="movie-table__td">
                <span className="movie-table__genre-badge">{movie.genre}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
