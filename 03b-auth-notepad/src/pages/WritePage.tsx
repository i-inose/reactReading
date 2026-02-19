// 【このファイルで学べること】
// - NoteForm を使ったメモ作成ページ
// - 作成成功後のリダイレクト

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import { NoteForm } from '../components/NoteForm';

export function WritePage() {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { title: string; content: string; tags: string }) => {
    setError(null);
    try {
      const created = await createNote(data);
      navigate(`/notes/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'メモの作成に失敗しました');
    }
  };

  return (
    <div>
      <h1 className="page__title">新規メモ作成</h1>
      <NoteForm
        onSubmit={handleSubmit}
        submitLabel="作成する"
        error={error}
      />
    </div>
  );
}
