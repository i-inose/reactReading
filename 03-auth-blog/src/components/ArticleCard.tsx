// ============================================================
// ArticleCard.tsx ― 記事カードコンポーネント
//
// 【このファイルで学べること】
// - Props としてデータを受け取るコンポーネント設計
// - 日時のフォーマット処理
// - Link コンポーネントによるページ遷移
// ============================================================

import { Link } from 'react-router-dom';
import type { Article } from '../types';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ArticleCardProps {
  article: Article;
}

/**
 * 記事一覧に表示するカードコンポーネント
 *
 * タイトル、著者名、作成日、本文の冒頭を表示する。
 * カード全体がリンクになっており、クリックで記事詳細ページへ遷移する。
 */
export function ArticleCard({ article }: ArticleCardProps) {
  // 日時を読みやすい形式にフォーマットする
  const formattedDate = new Date(article.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 本文から抜粋を生成する（先頭 100 文字）
  const excerpt = article.body.length > 100
    ? article.body.substring(0, 100) + '...'
    : article.body;

  return (
    <Link to={`/articles/${article.id}`} className="article-card">
      <h3 className="article-card__title">{article.title}</h3>
      <div className="article-card__meta">
        <span className="article-card__author">{article.author.username}</span>
        <span className="article-card__date">{formattedDate}</span>
      </div>
      <p className="article-card__excerpt">{excerpt}</p>
    </Link>
  );
}
