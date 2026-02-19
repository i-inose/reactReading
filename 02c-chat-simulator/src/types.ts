// ============================================================
// types.ts ― チャットアプリの型定義
// ============================================================

// ----------------------------------------------------------
// TODO(Q1): ChatMessage インターフェースと StreamStatus 型を定義してください
//
// ヒント:
// - ChatMessage には以下のプロパティが必要です:
//   id (string), role ("user" | "ai"), content (string),
//   timestamp (number), status ("complete" | "streaming")
// - StreamStatus は 3 つのリテラル型のユニオンです
// - interface と type alias の違いを意識しましょう
//
// 参考: 01-task-manager/src/types.ts の Task インターフェース
// ----------------------------------------------------------
export interface ChatMessage {
  id: undefined as any;
  role: undefined as any;
  content: undefined as any;
  timestamp: undefined as any;
  status: undefined as any;
}

export type StreamStatus = undefined as any;

// ----------------------------------------------------------
// TODO(Q2): ChatAction 判別共用体（Discriminated Union）を定義してください
//
// ヒント:
// - useReducer で使う Action 型です
// - 全てのアクションは type プロパティで判別されます
// - 以下の 5 つのアクションが必要です:
//   ADD_USER_MESSAGE:    payload は string（メッセージ内容）
//   START_AI_MESSAGE:    payload は string（メッセージID）
//   APPEND_AI_CHUNK:     payload は { id: string; chunk: string }
//   COMPLETE_AI_MESSAGE: payload は string（メッセージID）
//   SET_STATUS:          payload は StreamStatus
//
// 参考: TypeScript の判別共用体パターン
//   type Action = { type: "A"; payload: X } | { type: "B"; payload: Y }
// ----------------------------------------------------------
export type ChatAction = undefined as any;

// ----------------------------------------------------------
// ChatState ― useReducer で管理する状態の型
// ----------------------------------------------------------
export interface ChatState {
  messages: ChatMessage[];
  streamStatus: StreamStatus;
}
