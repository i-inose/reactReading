// ============================================================
// BoardPage.tsx ― メインボード画面
//
// 【このファイルで学べること】
// - 複数コンポーネントのコンポジション（チャットの ChatPage と同じ）
// - 条件付きレンダリング（接続状態に応じた表示切替）
// - useNavigate で未認証ユーザーをリダイレクトする
// ============================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Board } from "../components/Board.tsx";
import { AddNoteForm } from "../components/AddNoteForm.tsx";
import { UserList } from "../components/UserList.tsx";
import type { useBoard } from "../hooks/useBoard.ts";

// useBoard の戻り値の型をそのまま Props に使う（ReturnType ユーティリティ型）
type BoardPageProps = ReturnType<typeof useBoard>;

export function BoardPage({
  notes,
  cursors,
  status,
  connectedUsers,
  username,
  leave,
  addNote,
  moveNote,
  deleteNote,
  handleCursorMove,
}: BoardPageProps) {
  const navigate = useNavigate();

  // ユーザー名がなければ参加ページにリダイレクトする
  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username, navigate]);

  if (!username) return null;

  const isConnected = status === "connected";

  return (
    <div className="board-page">
      <Header status={status} onLeave={leave} />

      <div className="board-page__body">
        <main className="board-page__main">
          {/* 条件付きレンダリング: 接続状態によって表示を切り替える */}
          {status === "connecting" && (
            <div className="board-page__overlay">
              <p>接続中...</p>
            </div>
          )}

          {status === "disconnected" && (
            <div className="board-page__overlay">
              <p>切断されました</p>
            </div>
          )}

          <Board
            notes={notes}
            cursors={cursors}
            currentUser={username}
            onMoveNote={moveNote}
            onDeleteNote={deleteNote}
            onCursorMove={handleCursorMove}
          />

          <AddNoteForm onAdd={addNote} disabled={!isConnected} />
        </main>

        <UserList users={connectedUsers} currentUser={username} />
      </div>
    </div>
  );
}
