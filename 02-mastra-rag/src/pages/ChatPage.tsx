// ============================================================
// src/pages/ChatPage.tsx - Q&A チャットページ
// ============================================================
// 【このファイルで学べること】
// - カスタムフック（useChat）の利用
// - ページレベルのレイアウト構成
// - ref を使った自動スクロール
// ============================================================

import { useChat } from "../hooks/useChat";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";

export function ChatPage() {
  // --------------------------------------------------
  // useChat フックからチャットの状態と操作関数を取得
  // - messages: メッセージ一覧
  // - isLoading: AI が回答生成中かどうか
  // - send: メッセージ送信関数
  // - clear: チャット履歴クリア
  // - bottomRef: 自動スクロール用の参照
  // --------------------------------------------------
  const { messages, isLoading, send, clear, bottomRef } = useChat();

  return (
    <div className="chat-page">
      {/* ヘッダーエリア */}
      <div className="chat-page__header">
        <h2 className="chat-page__title">ドキュメント Q&amp;A</h2>
        {messages.length > 0 && (
          <button className="chat-page__clear" onClick={clear}>
            履歴をクリア
          </button>
        )}
      </div>

      {/* メッセージ一覧 */}
      <div className="chat-page__messages">
        {messages.length === 0 ? (
          <div className="chat-page__empty">
            <p>アップロードしたドキュメントについて質問できます。</p>
            <p>まずは「Documents」タブからドキュメントを追加してください。</p>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
        {/* 自動スクロールのアンカー */}
        <div ref={bottomRef} />
      </div>

      {/* 入力フォーム */}
      <ChatInput onSend={send} isLoading={isLoading} />
    </div>
  );
}
