// ============================================================
// CursorOverlay.tsx ― 他ユーザーのカーソル位置を表示するオーバーレイ
//
// 【このファイルで学べること】
// - 配列の map によるリスト描画
// - position: absolute でカーソルを自由配置する
// ============================================================

import type { Cursor } from "../types";

interface CursorOverlayProps {
  cursors: Cursor[];
  currentUser: string;
}

export function CursorOverlay({ cursors, currentUser }: CursorOverlayProps) {
  // 自分のカーソルは表示しない
  const otherCursors = cursors.filter((c) => c.username !== currentUser);

  if (otherCursors.length === 0) return null;

  return (
    <>
      {otherCursors.map((cursor) => (
        <div
          key={cursor.username}
          className="cursor-dot"
          style={{
            left: cursor.x,
            top: cursor.y,
            backgroundColor: cursor.color,
          }}
        >
          <span className="cursor-dot__label">{cursor.username}</span>
        </div>
      ))}
    </>
  );
}
