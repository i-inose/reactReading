// 【このファイルで学べること】
// - ログインユーザーの ID でデータを絞り込むパターン
// - 保護ルートの中で認証情報を活用する方法

import { useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import { NoteList } from '../components/NoteList';

export function MyNotesPage() {
  const { user } = useAuth();
  const { notes, isLoading, fetchNotes } = useNotes();

  // ログインユーザーのメモだけを取得
  useEffect(() => {
    if (user) {
      fetchNotes(user.id);
    }
  }, [user, fetchNotes]);

  return (
    <div>
      <h1 className="page__title">マイメモ</h1>
      <p className="page__description">{user?.username} さんのメモ一覧</p>
      <NoteList
        notes={notes}
        isLoading={isLoading}
        emptyMessage="メモがまだありません。「新規作成」から書いてみましょう！"
      />
    </div>
  );
}
