// ============================================================
// Board.tsx ― ホワイトボード領域
//
// 【このファイルで学べること】
// - コンポジション: StickyNote + CursorOverlay を組み合わせる
// - onMouseMove でカーソル位置を親に通知する
// - position: relative コンテナ内で子要素を absolute 配置する
// ============================================================

import { useCallback, useRef } from "react";
import type { StickyNote as StickyNoteType, Cursor } from "../types";
import { StickyNote } from "./StickyNote.tsx";
import { CursorOverlay } from "./CursorOverlay.tsx";

interface BoardProps {
  notes: StickyNoteType[];
  cursors: Cursor[];
  currentUser: string;
  onMoveNote: (noteId: string, x: number, y: number) => void;
  onDeleteNote: (noteId: string) => void;
  onCursorMove: (x: number, y: number) => void;
}

export function Board({
  notes,
  cursors,
  currentUser,
  onMoveNote,
  onDeleteNote,
  onCursorMove,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // ボード上のマウス移動をカーソル位置として通知する
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      onCursorMove(e.clientX - rect.left, e.clientY - rect.top);
    },
    [onCursorMove]
  );

  return (
    <div
      ref={boardRef}
      className="board"
      onMouseMove={handleMouseMove}
    >
      {notes.length === 0 && (
        <p className="board__empty">
          まだ付箋がありません。下のフォームから追加してください。
        </p>
      )}

      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          isOwn={note.author === currentUser}
          onMove={onMoveNote}
          onDelete={onDeleteNote}
        />
      ))}

      <CursorOverlay cursors={cursors} currentUser={currentUser} />
    </div>
  );
}
