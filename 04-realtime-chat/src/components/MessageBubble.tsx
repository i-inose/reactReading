// ============================================================
// MessageBubble.tsx ― メッセージ1件の表示コンポーネント
//
// 【このファイルで学べること】
// - 条件付きクラス名で自分のメッセージと他人のメッセージを出し分ける
// - React.memo による不要な再レンダリングの防止
// - 日付のフォーマット処理
// ============================================================

import { memo } from "react";
import type { ChatMessage } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface MessageBubbleProps {
  message: ChatMessage;     // 表示するメッセージデータ
  isOwn: boolean;           // 自分が送ったメッセージかどうか
}

// --------------------------------------------------
// タイムスタンプを「HH:MM」形式にフォーマットする
// --------------------------------------------------
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --------------------------------------------------
// MessageBubble コンポーネント
//
// 【React.memo とは？】
// コンポーネントの Props が変わらなければ再レンダリングをスキップする
// 高階コンポーネント（HOC）。チャットのように大量のアイテムを
// 表示する場合、パフォーマンスの最適化に効果がある。
// --------------------------------------------------
export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
}: MessageBubbleProps) {
  // システムメッセージ（入室・退室通知）の表示
  if (message.isSystem) {
    return (
      <div className="message-bubble message-bubble--system">
        <span className="message-bubble__text">{message.message}</span>
      </div>
    );
  }

  // --------------------------------------------------
  // 通常のメッセージ表示
  // 条件付きクラス名で左寄せ（他人）/ 右寄せ（自分）を切り替える
  // --------------------------------------------------
  const bubbleClass = [
    "message-bubble",
    isOwn ? "message-bubble--own" : "message-bubble--other",
  ].join(" ");

  return (
    <div className={bubbleClass}>
      {/* 他人のメッセージの場合のみユーザー名を表示する */}
      {!isOwn && (
        <span className="message-bubble__username">{message.username}</span>
      )}
      <div className="message-bubble__content">
        <p className="message-bubble__text">{message.message}</p>
        <time className="message-bubble__time">
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
});
