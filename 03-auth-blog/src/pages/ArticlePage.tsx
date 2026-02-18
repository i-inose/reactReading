// ============================================================
// ArticlePage.tsx ― 記事詳細ページ
//
// 【このファイルで学べること】
// - useParams でURLパラメータを取得する方法
// - 記事の著者のみに編集・削除ボタンを表示する認可制御
// - useNavigate によるプログラム的なページ遷移
// - 確認ダイアログ（window.confirm）の使い方
// ============================================================

import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';

export function ArticlePage() {
  // 【useParams とは？】
  // URL の動的パラメータを取得するフック。
  // /articles/:id のルートで /articles/3 にアクセスすると id = "3" になる。
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { article, isLoading, error, fetchArticle, deleteArticle } = useArticles();

  // URL パラメータから記事を取得する
  useEffect(() => {
    if (id) {
      fetchArticle(Number(id));
    }
  }, [id, fetchArticle]);

  // 記事の削除ハンドラ
  const handleDelete = async () => {
    if (!article) return;

    // ブラウザの確認ダイアログを表示する
    const confirmed = window.confirm('この記事を削除しますか？');
    if (!confirmed) return;

    try {
      await deleteArticle(article.id);
      navigate('/');  // 削除後はトップページへ遷移
    } catch (e) {
      alert(e instanceof Error ? e.message : '削除に失敗しました');
    }
  };

  // ローディング・エラー状態の表示
  if (isLoading) return <div className="loading">記事を読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <div className="error-message">記事が見つかりません</div>;

  // 現在のユーザーが記事の著者かどうかを判定する
  const isAuthor = user !== null && user.id === article.author.id;

  // 日時のフォーマット
  const createdAt = new Date(article.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const updatedAt = new Date(article.updated_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="page">
      <article className="article">
        <h1 className="article__title">{article.title}</h1>

        <div className="article__meta">
          <span className="article__author">著者: {article.author.username}</span>
          <span className="article__date">投稿日: {createdAt}</span>
          {article.created_at !== article.updated_at && (
            <span className="article__date">更新日: {updatedAt}</span>
          )}
        </div>

        {/* --------------------------------------------------
          認可に基づく条件付きレンダリング:
          記事の著者のみに編集・削除ボタンを表示する。
          これはフロントエンドの UI 制御であり、
          実際の権限チェックはバックエンドでも行う（二重チェック）。
        -------------------------------------------------- */}
        {isAuthor && (
          <div className="article__actions">
            <Link to={`/articles/${article.id}/edit`} className="button button--secondary">
              編集
            </Link>
            <button onClick={handleDelete} className="button button--danger">
              削除
            </button>
          </div>
        )}

        {/* 本文の改行を <br /> に変換して表示する */}
        <div className="article__body">
          {article.body.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </article>

      <Link to="/" className="back-link">記事一覧に戻る</Link>
    </div>
  );
}
