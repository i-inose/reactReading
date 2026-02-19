// ============================================================
// MovieDetailPage.tsx ― 映画詳細ページ
//
// 【このファイルで学べること】
// 1. useParams で URL パラメータ（:id）を取得する
// 2. 固定データから単一アイテムを検索する（find）
// 3. 早期リターンによるエラー状態の処理
// ============================================================

import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";

export function MovieDetailPage() {
  // :id を取得して数値に変換する
  const { id } = useParams<{ id: string }>();
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <p className="error-message">映画が見つかりません（ID: {id}）</p>;
  }

  const ratingClass =
    movie.rating >= 4.0
      ? "detail__rating--high"
      : movie.rating >= 3.0
        ? "detail__rating--mid"
        : "detail__rating--low";

  return (
    <div className="movie-detail">
      {/* パンくずリスト */}
      <nav className="breadcrumb">
        <Link to="/">映画一覧</Link>
        <span className="breadcrumb__separator">/</span>
        <span>{movie.title}</span>
      </nav>

      <div className="movie-detail__body">
        {/* ポスター */}
        <div className="movie-detail__poster">
          <img src={movie.posterUrl} alt={movie.title} className="movie-detail__img" />
        </div>

        {/* 情報 */}
        <div className="movie-detail__info">
          <h1 className="movie-detail__title">{movie.title}</h1>
          <div className="movie-detail__badges">
            <span className="movie-detail__genre">{movie.genre}</span>
            <span className={`movie-detail__rating ${ratingClass}`}>
              {movie.rating.toFixed(1)}
            </span>
          </div>

          <p className="movie-detail__description">{movie.description}</p>

          <dl className="movie-detail__specs">
            <dt>監督</dt>
            <dd>{movie.director}</dd>
            <dt>公開年</dt>
            <dd>{movie.year}年</dd>
            <dt>上映時間</dt>
            <dd>{movie.duration}分</dd>
            <dt>ジャンル</dt>
            <dd>{movie.genre}</dd>
            <dt>評価</dt>
            <dd>{movie.rating.toFixed(1)} / 5.0</dd>
          </dl>

          <Link to="/" className="btn btn--secondary">
            一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
