// ============================================================
// src/types.ts - 型定義ファイル
// ============================================================
// 【このファイルで学べること】
// - Discriminated Union（判別共用体）によるアクション定義
// - Union 型リテラルでステータスを型安全に管理
// - 02-mastra-rag の SSEData と同じパターンをローカルで再現
// ============================================================

// ストリーミングの状態を表す Union 型リテラル
export type StreamStatus = "idle" | "streaming" | "done";

// 読書エントリー: 原文テキストと要約をペアで保持
export interface ReadingEntry {
  id: string;
  originalText: string;
  summary: string;
  status: StreamStatus;
  createdAt: string; // ISO 8601
}

// --------------------------------------------------
// useReducer のアクション定義（Discriminated Union）
// type プロパティの文字列リテラルで判別する。
// 02-mastra-rag の ChatAction と同じパターン。
// --------------------------------------------------
export type EntryAction =
  | { type: "ADD_ENTRY"; payload: { id: string; originalText: string } }
  | { type: "APPEND_CHUNK"; payload: { id: string; chunk: string } }
  | { type: "COMPLETE"; payload: string }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "LOAD_ENTRIES"; payload: ReadingEntry[] };
