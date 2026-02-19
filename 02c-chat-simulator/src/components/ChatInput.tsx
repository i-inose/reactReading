import { useState } from "react";
import type { StreamStatus } from "../types.ts";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  streamStatus: StreamStatus;
}

// ============================================================
// TODO(Q8): useState で入力管理と onSubmit ハンドラを実装してください
//
// ヒント:
// - useState<string>("") で入力値を管理します
// - フォームの onSubmit ハンドラで:
//   1. e.preventDefault() でページリロードを防ぐ
//   2. input.trim() が空なら何もしない（早期リターン）
//   3. onSendMessage(input.trim()) でメッセージを送信
//   4. setInput("") で入力欄をクリア
// - ストリーミング中（streamStatus !== "idle"）はボタンを disabled にします
// - input の value と onChange を正しく接続します
//
// JSX の構造:
//   <form className="chat-input-form" onSubmit={handleSubmit}>
//     <input
//       type="text"
//       className="chat-input"
//       value={...}
//       onChange={...}
//       placeholder="メッセージを入力..."
//       disabled={streamStatus !== "idle"}
//     />
//     <button
//       type="submit"
//       className="send-button"
//       disabled={streamStatus !== "idle" || !input.trim()}
//     >
//       送信
//     </button>
//   </form>
//
// 参考: 01-task-manager/src/components/TaskForm.tsx
// ============================================================
export function ChatInput({ onSendMessage, streamStatus }: ChatInputProps) {
  return undefined as any;
}
