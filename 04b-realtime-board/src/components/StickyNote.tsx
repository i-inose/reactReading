// ============================================================
// StickyNote.tsx ― ドラッグ可能な付箋コンポーネント
//
// 【このファイルで学べること】
// - onMouseDown / onMouseMove / onMouseUp によるドラッグ実装
// - useRef でドラッグ中のオフセットを保持する
// - useCallback でイベントハンドラをメモ化する
// - position: absolute による自由配置
// ============================================================

import { useRef, useCallback } from "react";
import type { StickyNote as StickyNoteType } from "../types";

interface StickyNoteProps {
  note: StickyNoteType;
  isOwn: boolean;               // 自分が作成したノートか
  onMove: (noteId: string, x: number, y: number) => void;
  onDelete: (noteId: string) => void;
}

export function StickyNote({ note, isOwn, onMove, onDelete }: StickyNoteProps) {
  // ドラッグ中のオフセット（ノート内のクリック位置）を保持する
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // --------------------------------------------------
  // ドラッグ開始
  //
  // 【マウスイベントによるドラッグ実装】
  // 1. mousedown: ドラッグ開始。クリック位置とノート位置の差分を記録
  // 2. mousemove: document に addEventListener してノートを追従させる
  // 3. mouseup: ドラッグ終了。リスナーを解除
  // document にリスナーを追加することで、マウスがノート外に出ても追従する
  // --------------------------------------------------
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 削除ボタンのクリックではドラッグしない
      if ((e.target as HTMLElement).closest(".sticky-note__delete")) return;

      e.preventDefault();
      isDraggingRef.current = true;

      // ノート内でのクリック位置を記録する
      dragOffsetRef.current = {
        x: e.clientX - note.x,
        y: e.clientY - note.y,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const newX = Math.max(0, moveEvent.clientX - dragOffsetRef.current.x);
        const newY = Math.max(0, moveEvent.clientY - dragOffsetRef.current.y);
        onMove(note.id, newX, newY);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [note.id, note.x, note.y, onMove]
  );

  return (
    <div
      className="sticky-note"
      style={{
        left: note.x,
        top: note.y,
        backgroundColor: note.color,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="sticky-note__header">
        <span className="sticky-note__author">{note.author}</span>
        {isOwn && (
          <button
            className="sticky-note__delete"
            onClick={() => onDelete(note.id)}
            aria-label="削除"
          >
            x
          </button>
        )}
      </div>
      <p className="sticky-note__text">{note.text}</p>
    </div>
  );
}
