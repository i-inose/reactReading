// ============================================================
// GalleryPage.tsx ― メインギャラリーページ
//
// 【このファイルで学べること】
// - useEffect による初回データ取得
// - カスタムフック（useGallery, useAuth）の組み合わせ
// - ローディング状態とエラー状態の表示
// - 認証状態に応じた UI の出し分け
// ============================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../hooks/useGallery';
import { useAuth } from '../hooks/useAuth';
import { ImageCard } from '../components/ImageCard';

// --------------------------------------------------
// TODO(Q9): ギャラリーページコンポーネントを実装してください
//
// 【説明】
// 画像一覧を表示するメインページ。
// useEffect で初回マウント時に画像を読み込み、
// 認証済みの場合は「画像を追加」ボタンを表示する。
//
// 【実装手順】
// 1. useGallery() から images, isLoading, error, loadImages, deleteImage を取得
// 2. useAuth() から authState を取得
// 3. useEffect で loadImages() を初回マウント時に呼び出す
// 4. handleDelete 関数を実装（authState.user?.id を使って deleteImage を呼ぶ）
// 5. JSX を返す:
//    - ローディング中: ローディングメッセージ
//    - エラー時: エラーメッセージ
//    - 認証済み: 「画像を追加」リンクボタン
//    - 画像一覧: ImageCard をグリッド表示
//    - 画像なし: 空メッセージ
//
// 【ヒント】
// - useEffect(() => { loadImages(); }, [loadImages]) で初回読み込み
// - {authState.isAuthenticated && <Link to="/add">...</Link>} で条件表示
// - images.map(img => <ImageCard key={img.id} ... />) で一覧表示
// --------------------------------------------------

export function GalleryPage() {
  // TODO(Q9): useGallery と useAuth からデータと関数を取得してください
  const { images, isLoading, error, loadImages, deleteImage } = useGallery();
  const { authState } = useAuth();

  // TODO(Q9): useEffect で初回マウント時に loadImages を呼び出してください

  // 画像削除ハンドラ
  const handleDelete = (imageId: string) => {
    if (!authState.user) return;
    if (window.confirm('この画像を削除しますか？')) {
      deleteImage(imageId, authState.user.id);
    }
  };

  // TODO(Q9): ローディング、エラー、画像一覧の表示を実装してください
  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">画像ギャラリー</h1>
        <p className="page__description">
          みんなの画像コレクション
        </p>
        {/* TODO(Q9): 認証済みの場合のみ「画像を追加」リンクを表示してください */}
      </div>

      {isLoading && <div className="loading">読み込み中...</div>}
      {error && <div className="error-message">{error}</div>}

      {!isLoading && !error && images.length === 0 && (
        <div className="empty-message">まだ画像がありません</div>
      )}

      {!isLoading && !error && images.length > 0 && (
        <div className="gallery-grid">
          {/* TODO(Q9): images を map して ImageCard コンポーネントを表示してください */}
        </div>
      )}
    </div>
  );
}
