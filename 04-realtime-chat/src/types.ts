// ============================================================
// types.ts ― チャットアプリ全体で共有する型定義
//
// 【このファイルで学べること】
// - 判別共用体（Discriminated Union）による型安全なメッセージ設計
// - クライアント⇔サーバー間の通信プロトコルの型定義
// - WebSocket の接続状態を表す列挙的な型
// ============================================================

// --------------------------------------------------
// チャットルームの型
// リテラル型のユニオンで、有効なルーム名を制限する
// --------------------------------------------------
export type RoomName = "general" | "random" | "tech";

// ルーム情報の定数配列（表示名とキーの対応）
export const ROOMS: { key: RoomName; label: string }[] = [
  { key: "general", label: "一般" },
  { key: "random", label: "雑談" },
  { key: "tech", label: "技術" },
];

// --------------------------------------------------
// チャットメッセージ1件のデータ型
// --------------------------------------------------
export interface ChatMessage {
  username: string;    // 送信者の名前
  message: string;     // メッセージ本文
  timestamp: string;   // 送信日時（ISO 文字列）
  isSystem: boolean;   // システムメッセージか（入室・退室通知など）
}

// --------------------------------------------------
// WebSocket の接続状態
// UI で接続インジケーターを表示するために使う
// --------------------------------------------------
export type ConnectionStatus =
  | "connecting"    // 接続中
  | "connected"     // 接続済み
  | "disconnected"  // 切断
  | "reconnecting"; // 再接続中

// --------------------------------------------------
// クライアント → サーバーに送るメッセージ型
//
// 【判別共用体（Discriminated Union）とは？】
// 共通のプロパティ（ここでは type）の値で型を判別する仕組み。
// switch 文で type を分岐すると、TypeScript が各ケースの型を
// 自動で絞り込んでくれる（型の絞り込み = Type Narrowing）。
// --------------------------------------------------
export type ClientMessage =
  | { type: "join"; username: string; room: string }
  | { type: "leave"; room: string }
  | { type: "chat"; message: string }
  | { type: "typing" };

// --------------------------------------------------
// サーバー → クライアントに送るメッセージ型
// サーバーから来るデータも判別共用体で型安全に処理する
// --------------------------------------------------
export type ServerMessage =
  | { type: "chat"; username: string; message: string; timestamp: string; isSystem: boolean }
  | { type: "users"; users: string[] }
  | { type: "typing"; username: string }
  | { type: "room_history"; messages: ChatMessage[] };
