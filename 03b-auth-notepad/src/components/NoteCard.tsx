// 【このファイルで学べること】
// - Props の型定義とコンポーネント分離
// - Link によるページ遷移

import { Link } from 'react-router-dom';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  // 本文を100文字で切り詰めて抜粋にする
  const excerpt = note.content.length > 100
    ? note.content.slice(0, 100) + '...'
    : note.content;

  return (
    <Link to={`/notes/${note.id}`} className="note-card">
      <h3 className="note-card__title">{note.title}</h3>
      <div className="note-card__meta">
        <span>{note.ownerName}</span>
        <span>{new Date(note.updatedAt).toLocaleDateString('ja-JP')}</span>
      </div>
      {note.tags.length > 0 && (
        <div className="note-card__tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-card__tag">{tag}</span>
          ))}
        </div>
      )}
      <p className="note-card__excerpt">{excerpt}</p>
    </Link>
  );
}
