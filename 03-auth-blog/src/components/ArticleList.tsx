// ============================================================
// ArticleList.tsx ― 記事一覧表示コンポーネント
//
// 【このファイルで学べること】
// - 配列データの map による一覧レンダリング
// - key プロパティの重要性（React の差分検出アルゴリズム）
// - ローディング・エラー・空状態の3つの表示切り替え
// ============================================================

import type { Article } from '../types';
import { ArticleCard } from './ArticleCard';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 記事一覧コンポーネント
 *
 * 3つの状態を切り替えて表示する:
 * 1. ローディング中: スピナー表示
 * 2. エラー: エラーメッセージ表示
 * 3. 正常: 記事カードの一覧 or 空メッセージ
 */
export function ArticleList({ articles, isLoading, error }: ArticleListProps) {
  if (isLoading) {
    return <div className="loading">記事を読み込み中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (articles.length === 0) {
    return <div className="empty-message">まだ記事がありません</div>;
  }

  return (
    <div className="article-list">
      {/* 【map + key パターン】
        配列の各要素をコンポーネントに変換する。
        key は React が要素を一意に識別するために必要。
        key がないと、リストの更新時に不要な再レンダリングが発生する。 */}
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
