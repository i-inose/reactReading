// ============================================================
// AddImagePage.tsx ― 画像追加ページ（認証必須）
//
// 【このファイルで学べること】
// - フォームの状態管理
// - 認証ユーザー情報を使ったデータ作成
// - 画像 URL のプレビュー表示
// ============================================================

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGallery } from '../hooks/useGallery';

export function AddImagePage() {
  const { authState } = useAuth();
  const { addImage } = useGallery();
  const navigate = useNavigate();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!authState.user) {
      setError('ログインが必要です');
      return;
    }

    if (!url.trim() || !title.trim()) {
      setError('画像 URL とタイトルは必須です');
      return;
    }

    setIsSubmitting(true);
    try {
      addImage({
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        ownerId: authState.user.id,
        ownerName: authState.user.displayName,
      });
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像の追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__title">画像を追加</h2>

        {error && <div className="form__error">{error}</div>}

        <div className="form__field">
          <label htmlFor="url" className="form__label">画像 URL</label>
          <input
            id="url"
            type="url"
            className="form__input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://picsum.photos/seed/example/400/300"
          />
        </div>

        {/* 画像プレビュー */}
        {url && (
          <div className="form__preview">
            <img
              src={url}
              alt="プレビュー"
              className="form__preview-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="form__field">
          <label htmlFor="title" className="form__label">タイトル</label>
          <input
            id="title"
            type="text"
            className="form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="画像のタイトル"
          />
        </div>

        <div className="form__field">
          <label htmlFor="description" className="form__label">説明（任意）</label>
          <textarea
            id="description"
            className="form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="画像の説明を入力してください"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '追加中...' : '画像を追加'}
        </button>
      </form>
    </div>
  );
}
