// ============================================================
// MovieCard.tsx ― 映画ポスターカード
//
// 【このファイルで学べること】
// - Link で詳細ページに遷移する
// - 画像読み込み失敗時のフォールバック表示
// ============================================================

import { Link } from "react-router-dom";
import type { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // 評価に応じたバッジの色クラスを返す
  const ratingClass =
    movie.rating >= 4.0
      ? "movie-card__rating--high"
      : movie.rating >= 3.0
        ? "movie-card__rating--mid"
        : "movie-card__rating--low";

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-card__img"
          loading="lazy"
        />
        <span className={`movie-card__rating ${ratingClass}`}>
          {movie.rating.toFixed(1)}
        </span>
      </div>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.title}</h3>
        <span className="movie-card__genre">{movie.genre}</span>
        <p className="movie-card__meta">
          {movie.year}年 / {movie.duration}分
        </p>
      </div>
    </Link>
  );
}
