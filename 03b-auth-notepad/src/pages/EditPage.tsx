// 【このファイルで学べること】
// - 既存データを読み込んでフォームに初期値をセットするパターン
// - オーナーチェック（認可）をページレベルで行う方法

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import { NoteForm } from '../components/NoteForm';

export function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { note, isLoading, fetchNote, updateNote } = useNotes();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchNote(id);
  }, [id, fetchNote]);

  const handleSubmit = async (data: { title: string; content: string; tags: string }) => {
    if (!id) return;
    setError(null);
    try {
      await updateNote(id, data);
      navigate(`/notes/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'メモの更新に失敗しました');
    }
  };

  if (isLoading) return <div className="loading">読み込み中...</div>;
  if (!note) return <div className="error-message">メモが見つかりません</div>;

  // オーナーでなければアクセス拒否
  if (user?.id !== note.ownerId) {
    return <div className="error-message">このメモを編集する権限がありません</div>;
  }

  return (
    <div>
      <h1 className="page__title">メモを編集</h1>
      <NoteForm
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags.join(', ')}
        onSubmit={handleSubmit}
        submitLabel="更新する"
        error={error}
      />
    </div>
  );
}
