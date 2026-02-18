// ============================================================
// EditPage.tsx ― 記事編集ページ（認証 + 著者のみ）
//
// 【このファイルで学べること】
// - 既存データのフェッチと編集フォームへの流し込み
// - 認可チェック（フロントエンド側）
// - useEffect で非同期データを取得してフォームに反映するパターン
// ============================================================

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import { ArticleForm } from '../components/ArticleForm';

/**
 * 記事編集ページ
 *
 * ProtectedRoute で認証チェック済み。
 * さらに、記事の著者でない場合はトップページにリダイレクトする。
 */
export function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { article, isLoading, error, fetchArticle, updateArticle } = useArticles();

  // 記事データを取得する
  useEffect(() => {
    if (id) {
      fetchArticle(Number(id));
    }
  }, [id, fetchArticle]);

  // 著者チェック: 自分の記事でなければリダイレクト
  useEffect(() => {
    if (article && user && article.author.id !== user.id) {
      navigate('/');
    }
  }, [article, user, navigate]);

  // 記事更新のハンドラ
  const handleSubmit = async (data: { title: string; body: string }) => {
    if (!id) return;
    await updateArticle(Number(id), data);
    navigate(`/articles/${id}`);
  };

  // ローディング・エラー状態の表示
  if (isLoading) return <div className="loading">記事を読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <div className="error-message">記事が見つかりません</div>;

  return (
    <div className="page">
      <h1 className="page__title">記事を編集</h1>
      {/* initialValues を渡すことで編集モードになる */}
      <ArticleForm
        initialValues={{ title: article.title, body: article.body }}
        onSubmit={handleSubmit}
        submitLabel="更新する"
      />
    </div>
  );
}
