import { useChat } from "../hooks/useChat.ts";
import { ChatMessage } from "../components/ChatMessage.tsx";
import { ChatInput } from "../components/ChatInput.tsx";

// ============================================================
// TODO(Q10): useChat フックを使ってチャット画面を組み立ててください
//
// ヒント:
// - useChat() から messages, streamStatus, sendMessage, messagesEndRef を取得
// - messages.map() で各メッセージを <ChatMessage /> として描画します
// - key プロパティに message.id を使います（React のリスト描画で必須）
// - メッセージリストの末尾に自動スクロール用の <div ref={messagesEndRef} /> を配置
// - <ChatInput /> に onSendMessage と streamStatus を渡します
//
// JSX の構造:
//   <div className="chat-page">
//     <div className="chat-header">
//       <h1>Chat Simulator</h1>
//       <p>AI チャットシミュレーター</p>
//     </div>
//     <div className="chat-messages">
//       {messages を map して <ChatMessage /> を並べる}
//       <div ref={messagesEndRef} />
//     </div>
//     <ChatInput onSendMessage={...} streamStatus={...} />
//   </div>
//
// 参考: 01-task-manager/src/pages/HomePage.tsx のリスト描画
// ============================================================
export function ChatPage() {
  return undefined as any;
}
