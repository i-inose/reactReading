// ============================================================
// ImageCard.tsx ― 画像カードコンポーネント
//
// 【このファイルで学べること】
// - Props としてデータを受け取るコンポーネント設計
// - useAuth フックで認証状態を取得する方法
// - 条件付きレンダリング（所有者のみ削除ボタンを表示）
// - 03-auth-blog の ArticleCard.tsx との対比
// ============================================================

import type { GalleryImage } from '../types';
import { useAuth } from '../hooks/useAuth';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ImageCardProps {
  image: GalleryImage;
  onDelete: (id: string) => void;
}

// --------------------------------------------------
// TODO(Q8): 画像カードコンポーネントを実装してください
//
// 【説明】
// 画像のサムネイル、タイトル、投稿者名を表示するカード。
// 現在のユーザーが画像の所有者であれば、削除ボタンも表示する。
//
// 【実装手順】
// 1. useAuth() から authState を取得
// 2. authState.user?.id と image.ownerId を比較して所有者かどうか判定
// 3. 日時を読みやすい形式にフォーマット
// 4. JSX を返す:
//    - 画像（<img>）タグで image.url を表示
//    - タイトル、説明文、投稿者名、日時を表示
//    - isOwner が true の場合のみ削除ボタンを表示
//
// 【ヒント】
// - const isOwner = authState.user?.id === image.ownerId で判定
// - {isOwner && <button>...</button>} で条件付きレンダリング
// - onDelete(image.id) を削除ボタンの onClick で呼び出す
// --------------------------------------------------

export function ImageCard({ image, onDelete }: ImageCardProps) {
  // TODO(Q8): useAuth() から認証状態を取得し、所有者判定を行ってください
  const { authState } = useAuth();
  const isOwner = undefined as any;

  // 日時のフォーマット
  const formattedDate = new Date(image.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // TODO(Q8): 画像カードの JSX を返してください
  return (
    <div className="image-card">
      <div className="image-card__image-wrapper">
        <img
          src={image.url}
          alt={image.title}
          className="image-card__image"
          loading="lazy"
        />
      </div>
      <div className="image-card__body">
        <h3 className="image-card__title">{image.title}</h3>
        {image.description && (
          <p className="image-card__description">{image.description}</p>
        )}
        <div className="image-card__meta">
          <span className="image-card__owner">{image.ownerName}</span>
          <span className="image-card__date">{formattedDate}</span>
        </div>
        {/* TODO(Q8): isOwner が true の場合のみ削除ボタンを表示してください */}
      </div>
    </div>
  );
}
