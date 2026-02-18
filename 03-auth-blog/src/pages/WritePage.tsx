// ============================================================
// WritePage.tsx ― 記事作成ページ（認証必須）
//
// 【このファイルで学べること】
// - ProtectedRoute で保護されたページの実装
// - ArticleForm コンポーネントの再利用（作成モード）
// - 作成成功後のページ遷移
// ============================================================

import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { ArticleForm } from '../components/ArticleForm';

/**
 * 新規記事作成ページ
 *
 * このページは ProtectedRoute で保護されているため、
 * 未認証ユーザーがアクセスするとログインページにリダイレクトされる。
 * （App.tsx のルート定義を参照）
 */
export function WritePage() {
  const navigate = useNavigate();
  const { createArticle } = useArticles();

  // 記事作成のハンドラ
  const handleSubmit = async (data: { title: string; body: string }) => {
    const article = await createArticle(data);
    // 作成成功後、記事の詳細ページに遷移する
    navigate(`/articles/${article.id}`);
  };

  return (
    <div className="page">
      <h1 className="page__title">新しい記事を書く</h1>
      <ArticleForm onSubmit={handleSubmit} submitLabel="投稿する" />
    </div>
  );
}
