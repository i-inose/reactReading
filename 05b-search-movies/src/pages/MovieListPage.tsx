// ============================================================
// MovieListPage.tsx ― 映画一覧ページ
//
// 【このファイルで学べること】
// 1. カスタムフック（useMovies）で状態管理を UI から分離する
// 2. 検索・フィルタ・ソート・ページネーション・表示切替の統合
// 3. 条件付きレンダリング（カード / テーブルの切り替え）
// ============================================================

import { useMovies } from "../hooks/useMovies";
import { SearchBar } from "../components/SearchBar";
import { GenreFilter } from "../components/GenreFilter";
import { SortSelect } from "../components/SortSelect";
import { ViewToggle } from "../components/ViewToggle";
import { Pagination } from "../components/Pagination";
import { MovieCard } from "../components/MovieCard";
import { MovieTable } from "../components/MovieTable";

export function MovieListPage() {
  const {
    movies, total, totalPages, page, limit,
    search, genre, sort, order, viewMode,
    setPage, setSearch, setGenre, setSort, setViewMode, resetFilters,
  } = useMovies();

  const hasActiveFilters = search || genre;

  return (
    <div className="movie-list-page">
      <div className="movie-list-page__header">
        <h1 className="movie-list-page__title">映画一覧</h1>
        <span className="movie-list-page__count">{total}本の映画</span>
      </div>

      {/* 検索バー + ソート + 表示切替 */}
      <div className="movie-list-page__toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="movie-list-page__toolbar-right">
          <SortSelect sort={sort} order={order} onChange={setSort} />
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* ジャンルフィルタ */}
      <GenreFilter selectedGenre={genre} onChange={setGenre} />

      {/* リセットボタン */}
      {hasActiveFilters && (
        <button className="movie-list-page__reset" onClick={resetFilters}>
          フィルタをリセット
        </button>
      )}

      {/* 映画一覧 */}
      {movies.length === 0 ? (
        <p className="empty-message">条件に一致する映画が見つかりません</p>
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="movie-card-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <MovieTable movies={movies} sort={sort} order={order} onSort={setSort} />
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
