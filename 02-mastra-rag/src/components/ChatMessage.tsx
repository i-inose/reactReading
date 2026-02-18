// ============================================================
// src/components/ChatMessage.tsx - メッセージ表示
// ============================================================
// 【このファイルで学べること】
// - 条件付きレンダリング（ユーザー vs AI メッセージ）
// - useState による折りたたみ UI の実装
// - children の代わりに props でデータを受け渡すパターン
// ============================================================

import { useState } from "react";
import type { ChatMessage as ChatMessageType } from "../types";
import { SourceCard } from "./SourceCard";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // --------------------------------------------------
  // ソース表示の折りたたみ状態
  // デフォルトは閉じた状態（false）
  // --------------------------------------------------
  const [showSources, setShowSources] = useState(false);
  const hasSources = message.sources && message.sources.length > 0;

  // BEM 記法でロールに応じたクラス名を切り替え
  const roleClass =
    message.role === "user" ? "chat-message--user" : "chat-message--assistant";

  return (
    <div className={`chat-message ${roleClass}`}>
      {/* ロールラベル */}
      <div className="chat-message__role">
        {message.role === "user" ? "You" : "AI"}
      </div>

      {/* メッセージ本文 */}
      <div className="chat-message__content">
        {message.content || (
          <span className="chat-message__thinking">考え中...</span>
        )}
      </div>

      {/* ソース引用（AI メッセージのみ、折りたたみ可能） */}
      {hasSources && (
        <div className="chat-message__sources">
          <button
            className="chat-message__sources-toggle"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? "引用を隠す" : `引用を表示 (${message.sources!.length}件)`}
          </button>
          {showSources && (
            <div className="chat-message__sources-list">
              {message.sources!.map((source, i) => (
                <SourceCard key={i} source={source} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
