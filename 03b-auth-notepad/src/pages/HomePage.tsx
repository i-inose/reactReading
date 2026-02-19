// 【このファイルで学べること】
// - useEffect でコンポーネントマウント時にデータを取得するパターン
// - 公開ページ（全ユーザーのメモを一覧表示）

import { useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { NoteList } from '../components/NoteList';

export function HomePage() {
  const { notes, isLoading, fetchNotes } = useNotes();

  // マウント時に全メモを取得
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div>
      <h1 className="page__title">みんなのメモ</h1>
      <p className="page__description">すべてのユーザーが公開しているメモの一覧</p>
      <NoteList notes={notes} isLoading={isLoading} emptyMessage="まだメモがありません" />
    </div>
  );
}
