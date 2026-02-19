// 【このファイルで学べること】
// - useParams で URL パラメータを取得する方法
// - オーナーチェックによる編集/削除ボタンの表示制御（認可チェック）
// - useNavigate でプログラム的にページ遷移する方法

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';

export function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { note, isLoading, error, fetchNote, deleteNote } = useNotes();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchNote(id);
  }, [id, fetchNote]);

  // オーナーかどうかの判定（認可チェック）
  const isOwner = user !== null && note !== null && user.id === note.ownerId;

  const handleDelete = async () => {
    if (!note || !confirm('このメモを削除しますか？')) return;
    try {
      await deleteNote(note.id);
      navigate('/');
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : '削除に失敗しました');
    }
  };

  if (isLoading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!note) return <div className="error-message">メモが見つかりません</div>;

  return (
    <div>
      <h1 className="note-detail__title">{note.title}</h1>

      <div className="note-detail__meta">
        <span>{note.ownerName}</span>
        <span>作成: {new Date(note.createdAt).toLocaleDateString('ja-JP')}</span>
        {note.createdAt !== note.updatedAt && (
          <span>更新: {new Date(note.updatedAt).toLocaleDateString('ja-JP')}</span>
        )}
      </div>

      {note.tags.length > 0 && (
        <div className="note-detail__tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-card__tag">{tag}</span>
          ))}
        </div>
      )}

      {/* オーナーだけに編集・削除ボタンを表示する */}
      {isOwner && (
        <div className="note-detail__actions">
          <Link to={`/notes/${note.id}/edit`} className="button button--secondary">
            編集
          </Link>
          <button onClick={handleDelete} className="button button--danger">
            削除
          </button>
        </div>
      )}

      {deleteError && <div className="form__error">{deleteError}</div>}

      <div className="note-detail__body">{note.content}</div>

      <Link to="/" className="back-link">メモ一覧に戻る</Link>
    </div>
  );
}
