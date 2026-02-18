// ============================================================
// HomePage.tsx ― トップページ（記事一覧）
//
// 【このファイルで学べること】
// - useEffect による初回データ取得
// - カスタムフック（useArticles）の利用
// - ページコンポーネントの基本構成
// ============================================================

import { useEffect } from 'react';
import { useArticles } from '../hooks/useArticles';
import { ArticleList } from '../components/ArticleList';

/**
 * トップページ: 全記事の一覧を表示する（公開ページ）
 *
 * 【useEffect の第2引数（依存配列）】
 * [] を渡すと、コンポーネントの初回マウント時に1回だけ実行される。
 * 依存配列を省略すると毎回レンダリング時に実行されてしまう。
 */
export function HomePage() {
  const { articles, isLoading, error, fetchArticles } = useArticles();

  // コンポーネントの初回表示時に記事一覧を取得する
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="page">
      <h1 className="page__title">記事一覧</h1>
      <p className="page__description">
        最新の技術記事をお楽しみください
      </p>
      <ArticleList articles={articles} isLoading={isLoading} error={error} />
    </div>
  );
}
