import type { ChatMessage as ChatMessageType } from "../types.ts";
import { StreamingDots } from "./StreamingDots.tsx";

interface ChatMessageProps {
  message: ChatMessageType;
}

// ============================================================
// TODO(Q7): メッセージの条件付きレンダリングを実装してください
//
// ヒント:
// - message.role が "user" か "ai" かで表示スタイルを変えます
// - className に role に応じたクラスを付与します:
//   "chat-message user" または "chat-message ai"
// - AI メッセージで status === "streaming" の場合、
//   内容の後ろに <StreamingDots /> を表示します
// - タイムスタンプを表示します（new Date(timestamp).toLocaleTimeString()）
//
// JSX の構造:
//   <div className={`chat-message ${message.role}`}>
//     <div className="message-bubble">
//       <p className="message-content">{...}</p>
//       {ストリーミング中なら <StreamingDots /> を表示}
//     </div>
//     <span className="message-time">{時刻}</span>
//   </div>
//
// 参考: 01-task-manager/src/components/TaskCard.tsx の条件付きレンダリング
// ============================================================
export function ChatMessage({ message }: ChatMessageProps) {
  return undefined as any;
}
