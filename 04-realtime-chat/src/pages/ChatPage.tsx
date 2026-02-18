// ============================================================
// ChatPage.tsx ― メインチャット画面
//
// 【このファイルで学べること】
// - 複数のコンポーネントを組み合わせた画面構成（コンポジション）
// - カスタムフックを使ったロジックと UI の分離
// - 条件付きレンダリングによる状態別の画面表示
// - useNavigate で未認証ユーザーをリダイレクトする
// ============================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { UserList } from "../components/UserList";
import { RoomSelector } from "../components/RoomSelector";
import { TypingIndicator } from "../components/TypingIndicator";
import type { useChat } from "../hooks/useChat";

// --------------------------------------------------
// Props の型定義
// useChat の戻り値をそのまま受け取る
//
// 【ReturnType<typeof fn>】
// 関数の戻り値の型を取得するユーティリティ型。
// useChat の戻り値の型を手動で書き直す必要がなくなる。
// --------------------------------------------------
type ChatPageProps = ReturnType<typeof useChat> & {
  username: string | null;
};

// --------------------------------------------------
// ChatPage コンポーネント
// --------------------------------------------------
export function ChatPage({
  messages,
  users,
  typingUsers,
  currentRoom,
  username,
  status,
  sendChatMessage,
  changeRoom,
  notifyTyping,
  leave,
}: ChatPageProps) {
  const navigate = useNavigate();

  // --------------------------------------------------
  // 未認証ユーザーのリダイレクト
  // ユーザー名がなければ参加ページに戻す
  // --------------------------------------------------
  useEffect(() => {
    if (!username) {
      navigate("/");
    }
  }, [username, navigate]);

  // ユーザー名がない場合は何も表示しない
  if (!username) return null;

  const isConnected = status === "connected";

  return (
    <div className="chat-page">
      {/* ルーム選択タブ */}
      <RoomSelector currentRoom={currentRoom} onChangeRoom={changeRoom} />

      <div className="chat-page__body">
        {/* --------------------------------------------------
          メイン領域: メッセージ一覧 + 入力欄
          コンポジション: 複数の小さなコンポーネントを組み合わせて
          一つの画面を構成する React の基本パターン
        -------------------------------------------------- */}
        <main className="chat-page__main">
          <MessageList messages={messages} currentUser={username} />

          {/* 入力中表示 */}
          <TypingIndicator typingUsers={typingUsers} />

          {/* メッセージ入力 */}
          <MessageInput
            onSend={sendChatMessage}
            onTyping={notifyTyping}
            disabled={!isConnected}
          />
        </main>

        {/* サイドバー: オンラインユーザー一覧 */}
        <UserList users={users} currentUser={username} status={status} />
      </div>

      {/* 退出ボタン */}
      <div className="chat-page__footer">
        <button className="chat-page__leave-btn" onClick={leave}>
          退出する
        </button>
      </div>
    </div>
  );
}
