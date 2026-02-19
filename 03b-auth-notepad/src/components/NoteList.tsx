// 【このファイルで学べること】
// - 検索フィルタの実装パターン
// - 配列の filter メソッドによるリアルタイム絞り込み

import { useState } from 'react';
import type { Note } from '../types';
import { NoteCard } from './NoteCard';

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function NoteList({ notes, isLoading, emptyMessage = 'メモがありません' }: NoteListProps) {
  const [search, setSearch] = useState('');

  // タイトル・本文・タグで絞り込む
  const filtered = search.trim()
    ? notes.filter((n) => {
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : notes;

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          className="search-bar__input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="タイトル・本文・タグで検索..."
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty-message">
          {search ? '検索結果がありません' : emptyMessage}
        </p>
      ) : (
        <div className="note-list">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
